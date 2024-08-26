"use client"

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface LocalityWeatherData {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    rain_intensity: number;
    rain_accumulation: number;
}

interface WeatherData {
    status: number;
    message: string;
    device_type: number;
    locality_weather_data: LocalityWeatherData;
}

interface WeatherState {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
    localities: Record<string, Record<string, { localityId: string }>>;
}

const initialState: WeatherState = {
    data: null,
    loading: false,
    error: null,
    localities: {
        mumbai: {
            "Kandivali West": { localityId: "ZWL004934" },
            "Mira Road East": { localityId: "ZWL004934" },
            "Byculla": { localityId: "ZWL004934" },
            "Fort": { localityId: "ZWL004934" },
        },
        DelhiNCR: {
           "Palam Vihar, Gurgaon": { localityId: "ZWL005087" },
            "Sector 56, Gurgaon": { localityId: "ZWL003241" },
            "Sector 43, Gurgaon": { localityId: "ZWL007284" },
            "Sector 48, Gurgaon": { localityId: "ZWL003610" },
        },
        Bengaluru:{
            "Bannerghatta Road, Bangalore": { localityId: "ZWL004924" },
            "Yelahanka ": { localityId: "ZWL003241" },
            "Kadugodi": { localityId: "ZWL007284" },
            "HSR Layout ": { localityId: "ZWL003610" },
        }
    },
};

export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async (locality_id: string, { rejectWithValue }) => {
        const options = {
            method: 'GET',
            url: 'https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data',
            params: { locality_id },
            headers: { 'X-Zomato-Api-Key': 'ec8376f7cb4107688890dadc9728d34e' }
        };

        try {
            const { data } = await axios.request<WeatherData>(options);
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)

export const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default weatherSlice.reducer;