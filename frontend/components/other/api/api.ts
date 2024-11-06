export interface ApiResponse {
  carbonfootprint: {
    [key: string]: string
  }
  coupons: {
    title: string
    price: string
    link: string
  }[]
  coupontotal: string,
  ecosavings: number,
  model_used: string,
  image: string,
  total_footprint: string,
}

export async function uploadImage(file: File): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', file)
  console.log(process.env.API_USERNAME)
  console.log(process.env.API_PASSWORD)

  try {
    const response = await fetch('http://127.0.0.1:8000/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`)
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in uploadImage:', error)
    throw new Error('Failed to upload image. Please check your internet connection and try again.')
  }
}