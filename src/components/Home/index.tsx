import { FormProvider, useForm } from 'react-hook-form'
import { CategorySelector } from '../Category'

const Home = () => {
    const methods = useForm()

    return (
        <div className="mx-4 my-6">
            <form>
                <FormProvider {...methods}>
                    <CategorySelector />
                </FormProvider>
            </form>
        </div>
    )
}

export default Home
