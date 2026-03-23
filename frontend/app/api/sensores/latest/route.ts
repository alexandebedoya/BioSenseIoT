import { generateCurrentReading } from '@/lib/sensor-service'
import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const data = generateCurrentReading()
  
  return NextResponse.json(data)
}
