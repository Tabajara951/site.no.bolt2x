# Supabase Storage Setup Instructions

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

## 2. Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### Policy 1: Public Read Access
This allows anyone to view the uploaded images.

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );
```

### Policy 2: Public Upload Access
This allows anyone to upload images (you can restrict this later if needed).

```sql
CREATE POLICY "Enable insert for all users"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' );
```

### Policy 3: Public Update Access
This allows users to update existing images.

```sql
CREATE POLICY "Enable update for all users"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' )
WITH CHECK ( bucket_id = 'profile-images' );
```

### Policy 4: Public Delete Access
This allows users to delete images.

```sql
CREATE POLICY "Enable delete for all users"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-images' );
```

## 3. How to Apply Policies

1. In your Supabase Dashboard, go to **Storage**
2. Click on the `profile-images` bucket
3. Click **Policies** tab
4. Click **New Policy**
5. Choose **Custom policy**
6. Copy and paste each SQL policy above, one at a time

## 4. Verification

Once set up, your application will be able to:
- Upload profile images to the `profile-images` bucket
- Generate public URLs for the uploaded images
- Display the images on your portfolio site
- Update or delete images as needed

## 5. Image URL Format

After upload, images will be accessible at:
```
https://0ec90b57d6e95fcbda19832f.supabase.co/storage/v1/object/public/profile-images/[filename]
```
