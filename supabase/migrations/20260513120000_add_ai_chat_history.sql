-- Create AI Chat Sessions Table
CREATE TABLE public.ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create AI Chat Messages Table
CREATE TABLE public.ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);

-- Enable RLS
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.ai_chat_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Policies for messages
CREATE POLICY "Users can manage their own messages" 
ON public.ai_chat_messages 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chat_sessions 
        WHERE id = ai_chat_messages.session_id AND user_id = auth.uid()
    )
);

-- Storage bucket for chat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat-images
CREATE POLICY "Users can upload their own chat images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'chat-images' AND 
    auth.uid() = owner
);

CREATE POLICY "Anyone can view chat images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'chat-images' );
