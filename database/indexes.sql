-- Database Indexes for Performance
-- Run this after creating the main schema

-- Profiles indexes
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- Videos indexes
CREATE INDEX idx_videos_creator_id ON public.videos(creator_id);
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_is_public ON public.videos(is_public);
CREATE INDEX idx_videos_is_nft ON public.videos(is_nft);
CREATE INDEX idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX idx_videos_view_count ON public.videos(view_count DESC);
CREATE INDEX idx_videos_like_count ON public.videos(like_count DESC);
CREATE INDEX idx_videos_processing_status ON public.videos(processing_status);
CREATE INDEX idx_videos_tags ON public.videos USING GIN(tags);

-- NFTs indexes
CREATE INDEX idx_nfts_creator_id ON public.nfts(creator_id);
CREATE INDEX idx_nfts_owner_id ON public.nfts(owner_id);
CREATE INDEX idx_nfts_collection_id ON public.nfts(collection_id);
CREATE INDEX idx_nfts_vault_wallet_address ON public.nfts(vault_wallet_address);
CREATE INDEX idx_nfts_nft_mint_address ON public.nfts(nft_mint_address);
CREATE INDEX idx_nfts_is_minted ON public.nfts(is_minted);
CREATE INDEX idx_nfts_is_for_sale ON public.nfts(is_for_sale);
CREATE INDEX idx_nfts_rarity ON public.nfts(rarity);
CREATE INDEX idx_nfts_current_price ON public.nfts(current_price);
CREATE INDEX idx_nfts_created_at ON public.nfts(created_at DESC);

-- Collections indexes
CREATE INDEX idx_collections_creator_id ON public.collections(creator_id);
CREATE INDEX idx_collections_is_verified ON public.collections(is_verified);
CREATE INDEX idx_collections_floor_price ON public.collections(floor_price);
CREATE INDEX idx_collections_total_volume ON public.collections(total_volume DESC);

-- Follows indexes
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_follows_created_at ON public.follows(created_at DESC);

-- Likes indexes
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_video_id ON public.likes(video_id);
CREATE INDEX idx_likes_created_at ON public.likes(created_at DESC);

-- Comments indexes
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_video_id ON public.comments(video_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Conversations indexes
CREATE INDEX idx_conversations_participant_ids ON public.conversations USING GIN(participant_ids);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Video views indexes
CREATE INDEX idx_video_views_video_id ON public.video_views(video_id);
CREATE INDEX idx_video_views_user_id ON public.video_views(user_id);
CREATE INDEX idx_video_views_created_at ON public.video_views(created_at DESC);
CREATE INDEX idx_video_views_ip_address ON public.video_views(ip_address);

-- NFT transactions indexes
CREATE INDEX idx_nft_transactions_nft_id ON public.nft_transactions(nft_id);
CREATE INDEX idx_nft_transactions_from_user_id ON public.nft_transactions(from_user_id);
CREATE INDEX idx_nft_transactions_to_user_id ON public.nft_transactions(to_user_id);
CREATE INDEX idx_nft_transactions_transaction_type ON public.nft_transactions(transaction_type);
CREATE INDEX idx_nft_transactions_created_at ON public.nft_transactions(created_at DESC);
CREATE INDEX idx_nft_transactions_price ON public.nft_transactions(price DESC);

-- Composite indexes for common queries
CREATE INDEX idx_videos_creator_public_created ON public.videos(creator_id, is_public, created_at DESC);
CREATE INDEX idx_videos_category_public_created ON public.videos(category, is_public, created_at DESC);
CREATE INDEX idx_nfts_creator_minted_created ON public.nfts(creator_id, is_minted, created_at DESC);
CREATE INDEX idx_nfts_owner_sale_price ON public.nfts(owner_id, is_for_sale, current_price);
CREATE INDEX idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user_read_created ON public.notifications(user_id, is_read, created_at DESC);
