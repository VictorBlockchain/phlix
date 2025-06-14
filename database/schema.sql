-- Phlix Database Schema
-- Uses Solana wallet addresses as primary keys for user identity

-- Enable UUID extension for other tables that need UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE video_category AS ENUM (
  'creative', 'shorts', 'comedy', 'encrypted', 'music',
  'art', 'film', 'romance', 'anime', 'cartoon'
);

CREATE TYPE nft_rarity AS ENUM ('common', 'rare', 'legendary');
CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'system');
CREATE TYPE notification_type AS ENUM (
  'like', 'comment', 'follow', 'message', 'nft_mint', 'nft_sale', 'system'
);

-- Profiles table - uses Solana wallet address as primary key
CREATE TABLE public.profiles (
  id VARCHAR(50) PRIMARY KEY, -- Solana wallet address (base58, ~44 chars)
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  wallet_address VARCHAR(50) UNIQUE NOT NULL, -- Same as id, but kept for clarity
  is_verified BOOLEAN DEFAULT FALSE,
  is_creator BOOLEAN DEFAULT FALSE,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  nft_count INTEGER DEFAULT 0,
  total_earnings DECIMAL(20, 8) DEFAULT 0,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT profiles_id_wallet_match CHECK (id = wallet_address),
  CONSTRAINT profiles_username_length CHECK (length(username) >= 3),
  CONSTRAINT profiles_display_name_length CHECK (length(display_name) <= 100)
);

-- Collections table (create first to avoid circular references)
CREATE TABLE public.collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  banner_url TEXT,
  avatar_url TEXT,
  total_items INTEGER DEFAULT 0,
  floor_price DECIMAL(20, 8),
  total_volume DECIMAL(20, 8) DEFAULT 0,
  royalty_percentage DECIMAL(5, 2) DEFAULT 5.0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category video_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  resolution VARCHAR(20), -- e.g., "1920x1080"
  fps INTEGER DEFAULT 30,
  is_public BOOLEAN DEFAULT TRUE,
  is_nft BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  ai_metadata JSONB DEFAULT '{}', -- AI generation parameters
  processing_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFTs table
CREATE TABLE public.nfts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  creator_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE SET NULL,
  vault_wallet_address VARCHAR(50) NOT NULL, -- Solana wallet address for NFT storage
  nft_mint_address VARCHAR(50) UNIQUE, -- Solana NFT mint address
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  rarity nft_rarity DEFAULT 'common',
  mint_price DECIMAL(20, 8),
  current_price DECIMAL(20, 8),
  royalty_percentage DECIMAL(5, 2) DEFAULT 5.0, -- 0-100%
  metadata JSONB DEFAULT '{}',
  is_minted BOOLEAN DEFAULT FALSE,
  is_for_sale BOOLEAN DEFAULT FALSE,
  mint_transaction_hash VARCHAR(100),
  minted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows table (social relationships)
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Likes table
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table (for messaging)
CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_ids VARCHAR(50)[] NOT NULL,
  is_group BOOLEAN DEFAULT FALSE,
  group_name VARCHAR(100),
  group_avatar_url TEXT,
  last_message_id UUID,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  message_type message_type DEFAULT 'text',
  media_url TEXT,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video views table (for analytics)
CREATE TABLE public.video_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  watch_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT transactions table
CREATE TABLE public.nft_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nft_id UUID REFERENCES public.nfts(id) ON DELETE CASCADE NOT NULL,
  from_user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE SET NULL,
  to_user_id VARCHAR(50) REFERENCES public.profiles(id) ON DELETE SET NULL,
  transaction_type VARCHAR(20) NOT NULL, -- mint, sale, transfer
  price DECIMAL(20, 8),
  transaction_hash VARCHAR(100) NOT NULL,
  gas_fee DECIMAL(20, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to link videos to NFTs (after both tables exist)
ALTER TABLE public.videos ADD COLUMN nft_id UUID REFERENCES public.nfts(id) ON DELETE SET NULL;
