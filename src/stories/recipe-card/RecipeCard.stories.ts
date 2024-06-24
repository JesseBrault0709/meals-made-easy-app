import type { Meta, StoryObj } from '@storybook/react'
import RecipeCard from '../../components/recipe-card/RecipeCard'

const meta = {
    title: 'RecipeCard',
    component: RecipeCard
} satisfies Meta<typeof RecipeCard>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        title: 'My Recipe',
        owner: 'JesseBrault',
        rating: 5,
        imgUrl: 'https://www.simplyrecipes.com/thmb/L4nBpdZCubnbGtVbOW90JQSBVWc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Easy-Banana-Bread-LEAD-2-2-63dd39af009945d58f5bf4c2ae8d6070.jpg'
    }
}
