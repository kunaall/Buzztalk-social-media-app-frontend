import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography,InputBase,Button, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";
import { setComment } from "../../state/index";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments
}) => {
 
  const[commentt, setCommentt] = useState("");
  const[isComments,setIsComments] = useState(false);
  
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`https://buzztalksocialserver.vercel.app/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setCommentt("");
  };



  const handlecomment = async () => {

    const response = await fetch(`https://buzztalksocialserver.vercel.app/postss/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({comment:commentt}),
    });
    const updatedPost = await response.json();
    console.log(updatedPost);
    dispatch(setComment({ post: updatedPost }));
    setCommentt("");

    
 
   
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://buzztalksocialserver.vercel.app/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
        {comments.map((comment, i) => (
          <Box key={`${name}-${i}`}>
            <Divider />
            <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
              {comment}
            </Typography>
          </Box>
        ))}
        <Divider />
        <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        
        <InputBase
          placeholder="Add a Comment.."
          onChange={(e) => setCommentt(e.target.value)}
          value={commentt}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      <Divider sx={{ margin: "1.25rem 0" }} />
        <Button
          disabled={commentt===""}
          onClick={handlecomment}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST 
        </Button>
     </WidgetWrapper>
      </Box>)}
    </WidgetWrapper>
  );
};

export default PostWidget;
