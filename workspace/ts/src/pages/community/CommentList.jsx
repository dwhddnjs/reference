// import Submit from "@/components/Submit"
import CommentNew from "@/pages/community/CommentNew"
import CommentItem from "./CommentItem"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

async function fetchComments(postId) {
  const url = `https://api.fesp.shop/posts/${postId}/replies`
  const res = await fetch(url)
  return res.json()
}

// export default function CommentList({ replies }) {
export default function CommentList() {
  const { type, _id } = useParams()

  const { data } = useQuery({
    queryKey: [type, _id, "replies"],
    queryFn: () => {
      return fetchComments(_id)
    },
  })

  const list = data?.item?.map((item) => (
    <CommentItem key={item._id} item={item} />
  ))

  return (
    <section className="mb-8">
      <h4 className="mt-8 mb-4 ml-2">댓글 {data?.item?.length || 0}</h4>
      {list}
      <CommentNew />
    </section>
  )
}
