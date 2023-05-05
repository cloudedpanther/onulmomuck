import { useRecoilValue } from 'recoil'
import { categoriesState } from '../../store'
import CategoryBadgeContainer from './CategoryBadgeContainer'

const CategorySelector = () => {
    const categoryGroupList = useRecoilValue(categoriesState)

    return (
        <div>
            <p className="text-xs ml-2 mb-2 font-bold">원하는 카테고리만 볼 수 있어요</p>
            <div className="border-solid border-2 border-gray-400 rounded-md">
                {categoryGroupList
                    .map<React.ReactNode>(({ groupName, data, colorClass }) => {
                        return (
                            <CategoryBadgeContainer
                                key={groupName}
                                categoryList={data}
                                colorClass={colorClass}
                            />
                        )
                    })
                    .reduce((acc, cur, idx) => [
                        acc,
                        <div key={`divider-${idx}`} className="divider my-0 h-0 px-2"></div>,
                        cur,
                    ])}
            </div>
        </div>
    )
}

export default CategorySelector
