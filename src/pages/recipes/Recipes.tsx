import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '../../api/ApiError'
import getImage from '../../api/getImage'
import getRecipeInfos from '../../api/getRecipeInfos'
import { useAuth } from '../../AuthProvider'
import RecipeCard from '../../components/recipe-card/RecipeCard'
import classes from './recipes.module.css'
import { useRefresh } from '../../RefreshProvider'

const Recipes = () => {
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const { accessToken } = useAuth()
    const refresh = useRefresh()

    const queryClient = useQueryClient()
    const { data, isPending, error } = useQuery(
        {
            queryKey: ['recipeInfos'],
            queryFn: ({ signal }) =>
                getRecipeInfos({
                    accessToken,
                    pageNumber,
                    pageSize,
                    refresh,
                    signal
                })
        },
        queryClient
    )

    const slugsAndImgUrls = useQueries({
        queries:
            data !== undefined
                ? data.content.map(recipeInfoView => {
                      return {
                          enabled: recipeInfoView.mainImage !== null,
                          queryKey: [
                              'images',
                              recipeInfoView.mainImage?.owner.username,
                              recipeInfoView.mainImage?.filename
                          ],
                          queryFn: async ({ signal }: any) => {
                              // any needed in the params
                              const imgUrl = await getImage({
                                  accessToken,
                                  refresh,
                                  signal,
                                  url: recipeInfoView.mainImage!.url
                              })
                              return {
                                  slug: recipeInfoView.slug,
                                  imgUrl
                              }
                          }
                      }
                  })
                : []
    })

    if (isPending) {
        return <p>Loading...</p>
    } else if (error) {
        if (error instanceof ApiError) {
            return (
                <p>
                    ApiError: {error.status} {error.message}
                </p>
            )
        } else {
            return <p>Error: {error.message}</p>
        }
    } else {
        return (
            <>
                <h1>Recipes</h1>
                <section className={classes.recipeList}>
                    {data.content.map(view => (
                        <RecipeCard
                            key={view.id}
                            title={view.title}
                            ownerUsername={view.owner.username}
                            slug={view.slug}
                            mainImageUrl={
                                slugsAndImgUrls.find(({ data: slugAndImgUrl }) => {
                                    return slugAndImgUrl !== undefined && slugAndImgUrl.slug === view.slug
                                })?.data!.imgUrl ?? '' // hacky workaround. should pass a kind of <Image> child which loads its own data
                            }
                            mainImageAlt={view.mainImage?.alt ? view.mainImage.alt : undefined}
                            starCount={view.starCount}
                            isPublic={view.isPublic}
                        />
                    ))}
                </section>
            </>
        )
    }
}

export default Recipes
