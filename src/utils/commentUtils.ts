
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
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
    }

    // Get users separately since we can't establish a direct join
    const userIds = commentData
      .filter(comment => comment.user_id !== 'anonymous')
      .map(comment => comment.user_id);

    // Only fetch users if we have user IDs
    let usersMap: Record<string, any> = {}; // Changed to any to store more user data
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', userIds);

      if (!usersError && usersData) {
        // Create a map of user_id to user data for easy lookup
        usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Also fetch admin users if needed
    const adminUserIds = commentData
      .filter(comment => comment.user_type === 'admin' && comment.user_id !== 'anonymous')
      .map(comment => comment.user_id);

    // Only fetch admin users if we have admin IDs
    let adminsMap: Record<string, any> = {};
    if (adminUserIds.length > 0) {
      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('id, name, email')
        .in('id', adminUserIds);

      if (!adminsError && adminsData) {
        // Create a map of admin_id to admin data for easy lookup
        adminsMap = adminsData.reduce((acc, admin) => {
          acc[admin.id] = admin;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Transform the data to match our TicketComment interface
    const comments: TicketComment[] = commentData.map(comment => {
      let userData = null;
      let userDisplayName = 'Anonymous';
      let userEmail = '';

      if (comment.user_id !== 'anonymous') {
        if (comment.user_type === 'admin') {
          userData = adminsMap[comment.user_id];
          userDisplayName = userData ? userData.name : 'Admin';
          userEmail = userData ? userData.email : '';
        } else {
          userData = usersMap[comment.user_id];
          userDisplayName = userData ? userData.name : 'User';
          userEmail = userData ? userData.email : '';
        }
      }

      return {
        id: comment.id,
        ticket_id: comment.ticket_id,
        content: comment.content,
        created_at: comment.created_at,
        is_internal: comment.is_internal,
        user_type: comment.user_type as UserType,
        user_id: comment.user_id,
        user: userDisplayName,
        user_email: userEmail, // Add email to the comment object
      };
    });

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
    // Ensure we have a valid userId - accept any string now that column is TEXT type
    const validUserId = userId || 'anonymous';
    
    const { data, error } = await supabase
      .from('ticket_comments')
      .insert({
        ticket_id: ticketId,
        content,
        user_id: validUserId,
        user_type: userType,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }

    // Get the user's information if it's a registered user
    let userName = 'Anonymous';
    let userEmail = '';
    
    if (validUserId !== 'anonymous') {
      if (userType === 'admin') {
        // Fetch admin information
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('name, email')
          .eq('id', validUserId)
          .maybeSingle();
          
        if (!adminError && adminData) {
          userName = adminData.name;
          userEmail = adminData.email;
        }
      } else {
        // Fetch user information
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', validUserId)
          .maybeSingle();
          
        if (!userError && userData) {
          userName = userData.name;
          userEmail = userData.email;
        }
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
      user: userName,
      user_email: userEmail
    };

    return newComment;
  } catch (error: any) {
    console.error("Failed to add comment:", error);
    toast.error("Failed to add comment");
    return null;
  }
};
