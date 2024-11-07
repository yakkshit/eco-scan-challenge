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

  try {
    const response = await fetch('https://surviving-condor-cedz-dfdfcde1.koyeb.app/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_AUTH_PASSWORD}`) //needed fix unable to import from .env variables
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
