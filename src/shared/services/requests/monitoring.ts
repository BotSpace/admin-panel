import { instanceAuth } from "../instance";
import { MonitoringResponse } from "@/features/monitoring/types/monitoring";
import { AxiosResponse } from "axios";

// Umumiy monitoring ma'lumotlarini olish (boshqaruv paneli uchun)
export async function getMonitoringData(): Promise<
  AxiosResponse<MonitoringResponse>
> {
  return await instanceAuth.get<MonitoringResponse>("/used");
}

// Loyiha uchun monitoring ma'lumotlarini olish (project panel uchun)
export async function getProjectMonitoringData(
  projectId: string | number
): Promise<AxiosResponse<MonitoringResponse>> {
  return await instanceAuth.get<MonitoringResponse>(`/used/${projectId}`);
}

