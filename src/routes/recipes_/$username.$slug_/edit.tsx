import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/$username/$slug/edit')({
    component: () => <div>Hello /recipes/$username/$slug/edit!</div>
})
