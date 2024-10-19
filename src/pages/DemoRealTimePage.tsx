import { useEffect, useState } from "react";
import { SalesInvoice } from "../models/SalesInvoice.p";
import { useRealtimeList } from "../hooks/useRealtimeList";
import { useRoute } from "wouter";

export function DemoRealTimePage() {
    const [match, params] = useRoute("/realtime/:id");
    const id = params?.id;

    return <div></div>;
}