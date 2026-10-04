import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

export interface Bid {
    id: string;
    projectId: string;
    freelancerId: string;
    freelancerName?: string;
    freelancerTitle?: string;
    bidAmount: number;
    deliveryTime: number;
    message: string;
    status: 'active' | 'withdrawn' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

interface BidState {
    bids: Bid[];
    myBid: Bid | null;
    loading: boolean;
    error: string | null;
}

const initialState: BidState = {
    bids: [],
    myBid: null,
    loading: false,
    error: null,
};

// Async Thunks
export const placeBid = createAsyncThunk(
    "bid/placeBid",
    async (data: { projectId: string; bidAmount: number; deliveryTime: number; message: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/project/${data.projectId}/bids`, data);
            return response.data.bid;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to place bid");
        }
    }
);

export const fetchProjectBids = createAsyncThunk(
    "bid/fetchProjectBids",
    async (projectId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/project/${projectId}/bids`);
            return response.data.bids;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to fetch bids");
        }
    }
);

export const fetchMyBid = createAsyncThunk(
    "bid/fetchMyBid",
    async (projectId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/project/${projectId}/my-bid`);
            return response.data.bid;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to fetch your bid");
        }
    }
);

export const updateBid = createAsyncThunk(
    "bid/updateBid",
    async (data: { bidId: string; bidAmount: number; deliveryTime: number; message: string }, { rejectWithValue }) => {
        try {
            const { bidId, ...updateData } = data;
            const response = await axiosInstance.patch(`/project/bids/${bidId}`, updateData);
            return response.data.bid;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to update bid");
        }
    }
);

export const withdrawBid = createAsyncThunk(
    "bid/withdrawBid",
    async (bidId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/project/bids/${bidId}/withdraw`);
            return response.data.bid;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || "Failed to withdraw bid");
        }
    }
);

const bidSlice = createSlice({
    name: "bid",
    initialState,
    reducers: {
        clearBidError: (state) => {
            state.error = null;
        },
        resetBidState: (state) => {
            state.bids = [];
            state.myBid = null;
            state.loading = false;
            state.error = null;
        },
        addRealTimeBid: (state, action: PayloadAction<Bid>) => {
            const index = state.bids.findIndex(bid => bid.id === action.payload.id);
            if (index !== -1) {
                state.bids[index] = action.payload;
            } else {
                state.bids = [action.payload, ...state.bids];
            }
            if (state.myBid && state.myBid.id === action.payload.id) {
                state.myBid = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Place Bid
            .addCase(placeBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(placeBid.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.loading = false;
                state.myBid = action.payload;
                state.bids = [action.payload, ...state.bids];
            })
            .addCase(placeBid.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to place bid";
            })
            // Fetch Project Bids
            .addCase(fetchProjectBids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectBids.fulfilled, (state, action: PayloadAction<Bid[]>) => {
                state.loading = false;
                state.bids = action.payload;
            })
            .addCase(fetchProjectBids.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch bids";
            })
            // Fetch My Bid
            .addCase(fetchMyBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBid.fulfilled, (state, action: PayloadAction<Bid | null>) => {
                state.loading = false;
                state.myBid = action.payload;
            })
            .addCase(fetchMyBid.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch your bid";
            })
            // Update Bid
            .addCase(updateBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBid.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.loading = false;
                state.myBid = action.payload;
                const index = state.bids.findIndex(b => b.id === action.payload.id);
                if (index !== -1) state.bids[index] = action.payload;
            })
            .addCase(updateBid.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update bid";
            })
            // Withdraw Bid
            .addCase(withdrawBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawBid.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.loading = false;
                state.myBid = action.payload;
                const index = state.bids.findIndex(b => b.id === action.payload.id);
                if (index !== -1) state.bids[index] = action.payload;
            })
            .addCase(withdrawBid.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to withdraw bid";
            });
    },
});

export const { clearBidError, resetBidState, addRealTimeBid } = bidSlice.actions;
export default bidSlice.reducer;
