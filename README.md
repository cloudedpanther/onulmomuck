# OnulMoMuck(오늘모먹)

## ♦️ Contents

-   [Introduce](#introduce)
-   [Demo Video](#demo-video)
-   [Feature](#feature)
-   [Tech Stacks](#tech-stacks)
-   [Install & Run](#install--run)

<br />

## 🎉 Introduce

우리는 일상에서 많은 선택을 하며 살아갑니다. 그 중에는 비교적 중요한 것도 있고 사소한 것도 있죠. 사소한 것이라면… 특히 음식 메뉴 고르기 같은 게 있겠네요! 정신 없을 때는 이런 일에 신경을 뺏기는 것조차 힘이 들죠.

그럴 때 친구들에게 매번 카톡으로 ‘점메추(점심 메뉴 추천 좀)’ 따위를 보내고 아무 영양가 없는 답변만 받는 대신에, ‘오늘모먹’에서 다른 사람들이 먹은 같은 시간대의 메뉴를 확인해보세요! 특별히 생각나는 카테고리가 있다면 선택해서 볼 수도 있습니다.

여유로운 날에는 먹은 음식을 공유해보기도 하세요. 음식을 먹은 경험을 공유하는 것처럼 쉽게 잡담할 수 있는 게 없죠!

<br />

## 🎞 Demo Video

[![onulmomuck-demo](http://img.youtube.com/vi/K0gEfZ_yDC0/0.jpg)](https://youtu.be/K0gEfZ_yDC0)

<br />

## ✨ Feature

### 식사 메뉴 검색 & 참고

![readme-img-2](https://github.com/cloudedpanther/onulmomuck/assets/76900250/a479d0b9-239a-4177-9840-a37d204413d1)

-   다른 사용자들의 식사 메뉴를 참고해서 식사 메뉴를 골라보세요.
-   `식사 시간(아침, 점심 등)`과 `음식 종류(중식, 한식 등)`에 따른 카테고리로 구분해서 검색 결과를 볼 수 있습니다.
-   검색 시 고려해야 하는 많은 카테고리 요소와 키워드를 다루기 위해 react-hook-form 라이브러리를 사용했습니다.

        ```ts
        const { register, handleSubmit, clearErrors } = useFormContext<ISearchForm>()
        ```

        ```jsx
            <label htmlFor={tag.id} className="swap">
                <input type="checkbox" id={tag.id} {...register(tag.id, registerSettings)} />

                <CategoryBadgeUI className={`${defaultColorClass} swap-off`} text={tag.text} />

                <CategoryBadgeUI className={`${colorClass} swap-on`} text={tag.text} />
            </label>

            <input
                type="text"
                placeholder="Search…"
                className="input input-bordered focus:outline-none w-screen"
                {...register('search')}
            />
        ```

<br />

### 먹은 음식 공유 & 소통

![readme-img-1](https://github.com/cloudedpanther/onulmomuck/assets/76900250/540da37b-decc-4968-b9a5-8ebd9d09d592)

-   로그인한 사용자는 직접 식사 메뉴 사진을 첨부하고 간단한 글을 적어 게시물을 올릴 수 있습니다.
-   로그인한 사용자는 게시물마다 좋아요 표시를 하거나 댓글을 달 수 있습니다.

<br />

## 🔧 Tech Stacks

<strong>Frontend:</strong> HTML CSS Javascript React Tailwindcss DaisyUI Typescript

<strong>Database:</strong> Firebase

<br />

## 🔨 Install & Run

```bash
git clone https://github.com/cloudedpanther/onulmomuck.git
npm i
npm run dev
```
