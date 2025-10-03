<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function handleClick() {
  alert('Card button clicked')
}
</script>

<template>
  <main class="p-6">
    <h1 class="text-2xl font-bold mb-4">Home</h1>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>This is a test card.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Additional content can go here.</p>
        </CardContent>
        <CardFooter>
          <Button variant="link" size="sm" @click="handleClick">Action</Button>
        </CardFooter>
      </Card>
    </div>
  </main>
</template>
