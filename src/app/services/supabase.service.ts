import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

export interface WaveData {
  id?: string
  data: string
}


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key)
  }

  async getDataDevices() {
    const {data, error} = await this.supabase
    .from('devices')
    .select('*')
    return {data, error}
  }

  updateWaveData(waveData: WaveData) {
    const update = {
      ...waveData
    }

    this.updateData(waveData, "wave_data")
    .then((data) => {
      if (data.error) {
        console.log(data.error)
      }
    })

  }

  async updateData(newData: any, table: string) {
    const {data, error} = await this.supabase
    .from(table)
    .upsert(newData)

    return {data, error}
  }

  async subscribeChannel(channel: string, table: string) {
    return this.supabase.channel(channel)
    .on(
      'postgres_changes',
      {
        event: "*",
        schema: 'public',
        table: table
      },
      (payload) => {}
    )

  }
}
