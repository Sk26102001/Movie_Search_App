
import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function SkeletonCard() {
  return (
    <Card
      sx={{
        width: 300,
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Image */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={180}
        width="100%"
      />

      {/* Avatar and Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>

      {/* Body content */}
      <CardContent sx={{ pt: 0 }}>
        <Skeleton variant="text" height={18} width="90%" />
        <Skeleton variant="text" height={18} width="60%" />
        <Skeleton variant="text" height={14} width="100%" />
        <Skeleton variant="text" height={14} width="80%" />
      </CardContent>

      {/* Favorite button placeholder */}
      <IconButton
        disabled
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'grey',
        }}
      >
        <FavoriteBorderIcon />
      </IconButton>
    </Card>
  );
}
