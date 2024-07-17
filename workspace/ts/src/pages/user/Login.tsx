import InputError from "@/components/InputError"
import Submit from "@/components/Submit"
import { userState } from "@/recoil/user/atoms"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"

const SERVER = import.meta.env.VITE_API_SERVER

type LoginForm = {
  email: string
  password: string
}

async function login(formData: LoginForm) {
  const res = await fetch(`${SERVER}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
  return res.json()
}

export default function Login() {
  const navigate = useNavigate()
  const setUser = useSetRecoilState(userState)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>()

  const { mutate: checkLogin } = useMutation({
    mutationFn(formData) {
      return login(formData)
    },
    onSuccess(resData) {
      if (resData.ok) {
        alert(`${resData.item.name}님 회원가입을 환영합니다`)
        setUser({
          _id: resData.item._id,
          name: resData.item.name,
          profile: resData.item.profileImage,
          accessToken: resData.item.token.accessToken,
          refreshToken: resData.item.token.refreshToken,
        })
        navigate("/")
      } else {
        // API서버에서 에러 응답
        if (resData.errors) {
          resData.errors.forEach((error) =>
            setError(error.path, { message: error.msg })
          )
        } else if (resData.message) {
          alert(resData.message)
        }
      }
    },
    onError(err) {
      //네트워크 에러
      console.error(err.message)
      alert("잠시후 다시 이용해 주세염ㅎㅎ")
    },
  })

  return (
    <main className="min-w-80 flex-grow flex items-center justify-center">
      <div className="p-8 border border-gray-200 rounded-lg w-full max-w-md dark:bg-gray-600 dark:border-0">
        <div className="text-center py-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            로그인
          </h2>
        </div>

        <form onSubmit={handleSubmit(checkLogin)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="email"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              {...register("email", {
                required: "이메일을 입력하세요",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                  message: "이메일 형식이 아닙니다",
                },
                minLength: {
                  value: 2,
                  message: "이름을 2글자 이상 입력하세욤",
                },
              })}
            />
            <InputError target={errors.email} />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-200 mb-2"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              {...register("password", {
                requirsed: "비밀번호 입력하세요",
              })}
            />
            <InputError target={errors.password} />
            <a
              href="#"
              className="block mt-6 ml-auto text-gray-500 text-sm dark:text-gray-300 hover:underline"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <div className="mt-10 flex justify-center items-center">
            <Submit>로그인</Submit>
            <a
              href="/user/signup"
              className="ml-8 text-gray-800 hover:underline"
            >
              회원가입
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}
