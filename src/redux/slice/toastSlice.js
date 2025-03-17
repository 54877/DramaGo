import { createSlice } from "@reduxjs/toolkit"

const toastSlice = createSlice({
    name:'toastSlice',
    initialState:{
        messages:[],
    },
    reducers:{
        pushMsg:(state,action)=>{
            const {text,status} = action.payload;
            const id = Date.now();
            state.messages.push({
                id,
                text,
                status,
            });
        },
        removeMsg:(state,action) => {
            const msgId = action.payload;
            const index = state.messages.findIndex(message => message.id === msgId);
            
            if (index!==-1) {
                state.messages.splice(index,1);
            }
        },
    }
});

export default toastSlice.reducer;
export const {pushMsg,removeMsg} = toastSlice.actions;