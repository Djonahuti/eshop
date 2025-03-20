
import { Outlet } from "react-router-dom"


const AuthLayout = () => {
  return (
    <>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>
      </div>
    </div>
    </>
  )
}

export default AuthLayout