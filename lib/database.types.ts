export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          banner_url: string | null
          wallet_address: string | null
          is_verified: boolean
          is_creator: boolean
          follower_count: number
          following_count: number
          video_count: number
          nft_count: number
          total_earnings: number
          social_links: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          wallet_address?: string | null
          is_verified?: boolean
          is_creator?: boolean
          follower_count?: number
          following_count?: number
          video_count?: number
          nft_count?: number
          total_earnings?: number
          social_links?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          wallet_address?: string | null
          is_verified?: boolean
          is_creator?: boolean
          follower_count?: number
          following_count?: number
          video_count?: number
          nft_count?: number
          total_earnings?: number
          social_links?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          category: 'creative' | 'shorts' | 'comedy' | 'encrypted' | 'music' | 'art' | 'film' | 'romance' | 'anime' | 'cartoon'
          tags: string[]
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          file_size: number | null
          resolution: string | null
          fps: number
          is_public: boolean
          is_nft: boolean
          nft_id: string | null
          view_count: number
          like_count: number
          comment_count: number
          share_count: number
          ai_metadata: Json
          processing_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          category: 'creative' | 'shorts' | 'comedy' | 'encrypted' | 'music' | 'art' | 'film' | 'romance' | 'anime' | 'cartoon'
          tags?: string[]
          video_url: string
          thumbnail_url?: string | null
          duration?: number | null
          file_size?: number | null
          resolution?: string | null
          fps?: number
          is_public?: boolean
          is_nft?: boolean
          nft_id?: string | null
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          ai_metadata?: Json
          processing_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string | null
          category?: 'creative' | 'shorts' | 'comedy' | 'encrypted' | 'music' | 'art' | 'film' | 'romance' | 'anime' | 'cartoon'
          tags?: string[]
          video_url?: string
          thumbnail_url?: string | null
          duration?: number | null
          file_size?: number | null
          resolution?: string | null
          fps?: number
          is_public?: boolean
          is_nft?: boolean
          nft_id?: string | null
          view_count?: number
          like_count?: number
          comment_count?: number
          share_count?: number
          ai_metadata?: Json
          processing_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      nfts: {
        Row: {
          id: string
          video_id: string
          creator_id: string
          owner_id: string | null
          vault_wallet_address: string
          nft_mint_address: string | null
          collection_id: string | null
          title: string
          description: string | null
          rarity: 'common' | 'rare' | 'legendary'
          mint_price: number | null
          current_price: number | null
          royalty_percentage: number
          metadata: Json
          is_minted: boolean
          is_for_sale: boolean
          mint_transaction_hash: string | null
          minted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          creator_id: string
          owner_id?: string | null
          vault_wallet_address: string
          nft_mint_address?: string | null
          collection_id?: string | null
          title: string
          description?: string | null
          rarity?: 'common' | 'rare' | 'legendary'
          mint_price?: number | null
          current_price?: number | null
          royalty_percentage?: number
          metadata?: Json
          is_minted?: boolean
          is_for_sale?: boolean
          mint_transaction_hash?: string | null
          minted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          creator_id?: string
          owner_id?: string | null
          vault_wallet_address?: string
          nft_mint_address?: string | null
          collection_id?: string | null
          title?: string
          description?: string | null
          rarity?: 'common' | 'rare' | 'legendary'
          mint_price?: number | null
          current_price?: number | null
          royalty_percentage?: number
          metadata?: Json
          is_minted?: boolean
          is_for_sale?: boolean
          mint_transaction_hash?: string | null
          minted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          creator_id: string
          name: string
          description: string | null
          banner_url: string | null
          avatar_url: string | null
          total_items: number
          floor_price: number | null
          total_volume: number
          royalty_percentage: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description?: string | null
          banner_url?: string | null
          avatar_url?: string | null
          total_items?: number
          floor_price?: number | null
          total_volume?: number
          royalty_percentage?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          description?: string | null
          banner_url?: string | null
          avatar_url?: string | null
          total_items?: number
          floor_price?: number | null
          total_volume?: number
          royalty_percentage?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          video_id: string
          parent_id: string | null
          content: string
          like_count: number
          reply_count: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          parent_id?: string | null
          content: string
          like_count?: number
          reply_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          parent_id?: string | null
          content?: string
          like_count?: number
          reply_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_ids: string[]
          is_group: boolean
          group_name: string | null
          group_avatar_url: string | null
          last_message_id: string | null
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_ids: string[]
          is_group?: boolean
          group_name?: string | null
          group_avatar_url?: string | null
          last_message_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_ids?: string[]
          is_group?: boolean
          group_name?: string | null
          group_avatar_url?: string | null
          last_message_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string | null
          message_type: 'text' | 'image' | 'video' | 'system'
          media_url: string | null
          reply_to_id: string | null
          is_read: boolean
          is_edited: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content?: string | null
          message_type?: 'text' | 'image' | 'video' | 'system'
          media_url?: string | null
          reply_to_id?: string | null
          is_read?: boolean
          is_edited?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string | null
          message_type?: 'text' | 'image' | 'video' | 'system'
          media_url?: string | null
          reply_to_id?: string | null
          is_read?: boolean
          is_edited?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          actor_id: string | null
          type: 'like' | 'comment' | 'follow' | 'message' | 'nft_mint' | 'nft_sale' | 'system'
          title: string
          message: string | null
          data: Json
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          actor_id?: string | null
          type: 'like' | 'comment' | 'follow' | 'message' | 'nft_mint' | 'nft_sale' | 'system'
          title: string
          message?: string | null
          data?: Json
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          actor_id?: string | null
          type?: 'like' | 'comment' | 'follow' | 'message' | 'nft_mint' | 'nft_sale' | 'system'
          title?: string
          message?: string | null
          data?: Json
          is_read?: boolean
          created_at?: string
        }
      }
      video_views: {
        Row: {
          id: string
          video_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          watch_duration: number
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          watch_duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          watch_duration?: number
          created_at?: string
        }
      }
      nft_transactions: {
        Row: {
          id: string
          nft_id: string
          from_user_id: string | null
          to_user_id: string | null
          transaction_type: string
          price: number | null
          transaction_hash: string
          gas_fee: number | null
          created_at: string
        }
        Insert: {
          id?: string
          nft_id: string
          from_user_id?: string | null
          to_user_id?: string | null
          transaction_type: string
          price?: number | null
          transaction_hash: string
          gas_fee?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          nft_id?: string
          from_user_id?: string | null
          to_user_id?: string | null
          transaction_type?: string
          price?: number | null
          transaction_hash?: string
          gas_fee?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      video_category: 'creative' | 'shorts' | 'comedy' | 'encrypted' | 'music' | 'art' | 'film' | 'romance' | 'anime' | 'cartoon'
      nft_rarity: 'common' | 'rare' | 'legendary'
      message_type: 'text' | 'image' | 'video' | 'system'
      notification_type: 'like' | 'comment' | 'follow' | 'message' | 'nft_mint' | 'nft_sale' | 'system'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
