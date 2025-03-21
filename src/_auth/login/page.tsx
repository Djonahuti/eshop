import AuthForm from "@/components/shared/Forms/AuthForm"


const SignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="login" />
    </section>
  )
}

export default SignIn