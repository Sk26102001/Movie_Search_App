import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

export default function SkeletonCard() {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <Skeleton variant="rectangular" height={450} />
      <CardContent>
        <Skeleton height={30} width="80%" />
        <Skeleton height={20} width="60%" />
      </CardContent>
    </Card>
  );
}
