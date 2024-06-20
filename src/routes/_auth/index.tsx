import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/')({
    component: () => {
        const client = useQuery({
            queryKey: ['index'],
            queryFn() {
                return 'Hello, Jesse!'
            }
        })
        return (
            <div>
                <h2>Index Page – You are logged in.</h2>
                {client.data ? <h3>{client.data}</h3> : null}
            </div>
        )
    }
})
