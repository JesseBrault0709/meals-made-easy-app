import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
    component: () => {
        const client = useQuery({
            queryKey: ['index'],
            queryFn() {
                return 'Hello, Jesse!'
            }
        })
        return <div>{client.data ? <h2>{client.data}</h2> : null}</div>
    }
})
