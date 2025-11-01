import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, JPG, PNG, and WebP images are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `review-photos/${timestamp}-${randomString}.${fileExt}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check if bucket exists, create if it doesn't
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === 'reviews')
    
    if (!bucketExists) {
      // Create the bucket with public access for review photos
      const { error: createError } = await supabaseAdmin.storage.createBucket('reviews', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB in bytes
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json({ 
          success: false, 
          message: 'Storage bucket not found. Please create a bucket named "reviews" in Supabase Storage.' 
        }, { status: 500 })
      }
      
      console.log('✅ Created public bucket "reviews"')
    } else {
      // Verify bucket is public
      const bucket = buckets?.find(b => b.name === 'reviews')
      if (bucket && !bucket.public) {
        console.warn('⚠️ Bucket "reviews" exists but is not public. Please make it public in Supabase Dashboard.')
      } else {
        console.log('✅ Bucket "reviews" exists and is public')
      }
    }

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('reviews')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      
      // Provide specific error message for bucket not found
      if (error.message?.includes('Bucket not found') || error.message?.includes('404')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Storage bucket "reviews" not found. Please create it in your Supabase dashboard under Storage.' 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to upload photo' 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('reviews')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl
    
    console.log('Photo uploaded successfully:', {
      fileName,
      publicUrl,
      bucket: 'reviews'
    })

    // Verify the URL format is correct
    if (!publicUrl || !publicUrl.startsWith('http')) {
      console.error('Invalid public URL generated:', publicUrl)
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to generate valid photo URL' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: fileName
    }, { status: 200 })

  } catch (error) {
    console.error('Error in photo upload:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload photo' 
    }, { status: 500 })
  }
}

