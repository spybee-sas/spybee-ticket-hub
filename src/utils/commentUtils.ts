
import { TicketComment, UserType } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches comments for a specific ticket
 * @param ticketId The ID of the ticket to fetch comments for
 * @returns A promise that resolves to an array of comments
 */
export const fetchTicketComments = async (ticketId: string): Promise<TicketComment[]> => {
  try {
    const { data: commentData, error } = await supabase
      .from('ticket_comments')
      .select(`
        id,
        ticket_id,
        content,
        created_at,
        is_internal,
        user_type,
        user_id
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }

    // Get users separately since we can't establish a direct join
    const userIds = commentData
      .filter(comment => comment.user_id !== 'anonymous')
      .map(comment => comment.user_id);

    // Only fetch users if we have user IDs
    let usersMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', userIds);

      if (!usersError && usersData) {
        // Create a map of user_id to name for easy lookup
        usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Transform the data to match our TicketComment interface
    const comments: TicketComment[] = commentData.map(comment => ({
      id: comment.id,
      ticket_id: comment.ticket_id,
      content: comment.content,
      created_at: comment.created_at,
      is_internal: comment.is_internal,
      user_type: comment.user_type as UserType, // Cast string to UserType
      user_id: comment.user_id,
      // Use the user's name from our map if available, otherwise use user type as fallback
      user: usersMap[comment.user_id] || (comment.user_type === 'admin' ? 'Admin' : 'User')
    }));

    return comments;
  } catch (error: any) {
    console.error("Failed to fetch ticket comments:", error);
    toast.error("Failed to load comments");
    return [];
  }
};

/**
 * Adds a new comment to a ticket
 * @param ticketId The ID of the ticket to add the comment to
 * @param content The content of the comment
 * @param userId The ID of the user adding the comment
 * @param userType The type of user (admin or user)
 * @param isInternal Whether the comment is internal (only visible to admins)
 * @returns A promise that resolves to the new comment if successful
 */
export const addTicketComment = async (
  ticketId: string,
  content: string,
  userId: string,
  userType: UserType,
  isInternal: boolean = false
): Promise<TicketComment | null> => {
  try {
    const { data, error } = await supabase
      .from('ticket_comments')
      .insert({
        ticket_id: ticketId,
        content,
        user_id: userId,
        user_type: userType,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }

    // Get the user's name if it's a registered user
    let userName = userType === 'admin' ? 'Admin' : 'User';
    
    if (userId !== 'anonymous') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();
        
      if (!userError && userData) {
        userName = userData.name;
      }
    }

    // Create and return the new comment object
    const newComment: TicketComment = {
      id: data.id,
      ticket_id: data.ticket_id,
      content: data.content,
      created_at: data.created_at,
      is_internal: data.is_internal,
      user_type: data.user_type as UserType,
      user_id: data.user_id,
      user: userName
    };

    return newComment;
  } catch (error: any) {
    console.error("Failed to add comment:", error);
    toast.error("Failed to add comment");
    return null;
  }
};
