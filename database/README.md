# Phlix Database Setup Guide

This guide will help you set up the complete database schema for Phlix, including video storage, NFT minting, user profiles, social features, and messaging.

## Prerequisites

1. **Supabase Project**: You should already have a Supabase project set up (based on your .env.local file)
2. **Supabase CLI** (optional but recommended): Install from [Supabase CLI docs](https://supabase.com/docs/guides/cli)

## Database Setup Steps

### 1. Run SQL Scripts in Order

Execute these SQL files in the Supabase SQL Editor in the following order:

1. **Schema Creation**: `database/schema.sql`
   - Creates all tables, types, and basic structure
   - Defines relationships between tables

2. **Indexes**: `database/indexes.sql`
   - Adds performance indexes for common queries
   - Improves search and filtering performance

3. **Triggers**: `database/triggers.sql`
   - Sets up automatic data consistency
   - Handles count updates and profile creation

4. **RLS Policies**: `database/rls_policies.sql`
   - Enables Row Level Security
   - Protects user data and privacy

### 2. Create Storage Buckets

In the Supabase Dashboard, go to **Storage** and create these buckets:

1. **videos** - For storing video files
   - Make public: Yes
   - File size limit: 500MB
   - Allowed file types: mp4, webm, mov

2. **images** - For storing thumbnails and general images
   - Make public: Yes
   - File size limit: 10MB
   - Allowed file types: jpg, jpeg, png, webp, gif

3. **avatars** - For storing user profile pictures
   - Make public: Yes
   - File size limit: 5MB
   - Allowed file types: jpg, jpeg, png, webp

### 3. Configure Storage Policies

For each bucket, set up these policies in the Supabase Dashboard:

#### Videos Bucket Policies:
```sql
-- Allow users to upload videos to their own folder
CREATE POLICY "Users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public access to videos
CREATE POLICY "Videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Images Bucket Policies:
```sql
-- Allow users to upload images to their own folder
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public access to images
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Avatars Bucket Policies:
```sql
-- Allow users to upload avatars to their own folder
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public access to avatars
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 4. Install Required Dependencies

Add the Supabase client to your project:

```bash
npm install @supabase/supabase-js
```

### 5. Environment Variables

Your `.env.local` file should already be configured with:

```env
NEXT_PUBLIC_SUPABASE_URL="https://vnatqsclcxsjjrsyvqvv.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Storage buckets
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_VIDEOS=videos
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_IMAGES=images
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_AVATARS=avatars

# NFT Configuration (to be configured later)
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_NFT_PACKAGE_ID=your_nft_package_id_here
NEXT_PUBLIC_VAULT_WALLET_PRIVATE_KEY=your_vault_wallet_private_key_here
```

## Database Schema Overview

### Core Tables

1. **profiles** - User profiles extending Supabase auth
2. **videos** - Video content with metadata
3. **nfts** - NFT information linked to videos
4. **collections** - NFT collections
5. **follows** - Social following relationships
6. **likes** - Video likes
7. **comments** - Video comments with threading
8. **conversations** - Chat conversations
9. **messages** - Individual messages
10. **notifications** - User notifications
11. **video_views** - Analytics for video views
12. **nft_transactions** - NFT transaction history

### Key Features

- **Automatic Profile Creation**: When users sign up, a profile is automatically created
- **Real-time Updates**: Supports real-time subscriptions for messages and notifications
- **Social Features**: Following, likes, comments with proper counting
- **NFT Integration**: Videos can be minted as NFTs with vault wallet addresses
- **Messaging System**: Direct messages and group chats
- **Analytics**: Video view tracking and user engagement metrics
- **Security**: Row Level Security (RLS) protects user data

### File Storage Structure

```
videos/
  ├── {user_id}/
  │   ├── {video_id}.mp4
  │   └── {video_id}_thumb.jpg

images/
  ├── {user_id}/
  │   ├── thumbnails/
  │   └── posts/

avatars/
  ├── {user_id}/
  │   └── avatar.jpg
```

## Usage Examples

The `lib/supabase.ts` file provides helper functions for common operations:

```typescript
import { supabase, getVideos, createVideo, uploadFile } from '@/lib/supabase'

// Get videos by category
const videos = await getVideos({ category: 'creative', limit: 20 })

// Upload a video file
const videoFile = new File([...], 'video.mp4')
const uploadResult = await uploadFile('VIDEOS', `${userId}/${videoId}.mp4`, videoFile)

// Create video record
const video = await createVideo({
  creator_id: userId,
  title: 'My Video',
  category: 'creative',
  video_url: uploadResult.path
})
```

## Next Steps

1. **Test the Setup**: Create a test user and verify all tables are working
2. **Implement NFT Minting**: Set up Sui blockchain integration for NFT minting
3. **Add Real-time Features**: Implement live messaging and notifications
4. **Set up Analytics**: Add video view tracking and user engagement metrics
5. **Configure Backups**: Set up automated database backups in Supabase

## Troubleshooting

- **RLS Errors**: Make sure you're authenticated when testing queries
- **Storage Upload Errors**: Check bucket policies and file size limits
- **Performance Issues**: Verify indexes are created properly
- **Type Errors**: Regenerate types with `supabase gen types typescript`

For more help, refer to the [Supabase Documentation](https://supabase.com/docs) or check the project's GitHub issues.
