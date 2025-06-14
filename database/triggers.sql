-- Database Triggers and Functions
-- Run this after creating schema and indexes

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfts_updated_at BEFORE UPDATE ON public.nfts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for the user being followed
    UPDATE public.profiles 
    SET follower_count = follower_count + 1 
    WHERE id = NEW.following_id;
    
    -- Increment following count for the user doing the following
    UPDATE public.profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count for the user being unfollowed
    UPDATE public.profiles 
    SET follower_count = GREATEST(follower_count - 1, 0) 
    WHERE id = OLD.following_id;
    
    -- Decrement following count for the user doing the unfollowing
    UPDATE public.profiles 
    SET following_count = GREATEST(following_count - 1, 0) 
    WHERE id = OLD.follower_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_follow_counts_trigger
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Function to update video counts and like counts
CREATE OR REPLACE FUNCTION update_video_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'videos' THEN
      -- Increment video count for creator
      UPDATE public.profiles 
      SET video_count = video_count + 1 
      WHERE id = NEW.creator_id;
      
      -- Increment NFT count if it's an NFT
      IF NEW.is_nft THEN
        UPDATE public.profiles 
        SET nft_count = nft_count + 1 
        WHERE id = NEW.creator_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'likes' THEN
      -- Increment like count for video
      UPDATE public.videos 
      SET like_count = like_count + 1 
      WHERE id = NEW.video_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'videos' THEN
      -- Decrement video count for creator
      UPDATE public.profiles 
      SET video_count = GREATEST(video_count - 1, 0) 
      WHERE id = OLD.creator_id;
      
      -- Decrement NFT count if it was an NFT
      IF OLD.is_nft THEN
        UPDATE public.profiles 
        SET nft_count = GREATEST(nft_count - 1, 0) 
        WHERE id = OLD.creator_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'likes' THEN
      -- Decrement like count for video
      UPDATE public.videos 
      SET like_count = GREATEST(like_count - 1, 0) 
      WHERE id = OLD.video_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_counts_trigger
  AFTER INSERT OR DELETE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_video_counts();

CREATE TRIGGER update_like_counts_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_video_counts();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment comment count for video
    UPDATE public.videos 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.video_id;
    
    -- If it's a reply, increment reply count for parent comment
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE public.comments 
      SET reply_count = reply_count + 1 
      WHERE id = NEW.parent_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement comment count for video
    UPDATE public.videos 
    SET comment_count = GREATEST(comment_count - 1, 0) 
    WHERE id = OLD.video_id;
    
    -- If it was a reply, decrement reply count for parent comment
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE public.comments 
      SET reply_count = GREATEST(reply_count - 1, 0) 
      WHERE id = OLD.parent_id;
    END IF;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_counts_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Function to update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.conversations 
    SET 
      last_message_id = NEW.id,
      last_message_at = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Function to update collection stats
CREATE OR REPLACE FUNCTION update_collection_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment total items in collection
    IF NEW.collection_id IS NOT NULL THEN
      UPDATE public.collections 
      SET total_items = total_items + 1 
      WHERE id = NEW.collection_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement total items in collection
    IF OLD.collection_id IS NOT NULL THEN
      UPDATE public.collections 
      SET total_items = GREATEST(total_items - 1, 0) 
      WHERE id = OLD.collection_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collection_stats_trigger
  AFTER INSERT OR DELETE ON public.nfts
  FOR EACH ROW EXECUTE FUNCTION update_collection_stats();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
