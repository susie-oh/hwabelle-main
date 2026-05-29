-- Add SELECT policies to allow admins to read all chat sessions and messages
CREATE POLICY "Admins can view all sessions" 
ON public.ai_chat_sessions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can view all messages" 
ON public.ai_chat_messages 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
