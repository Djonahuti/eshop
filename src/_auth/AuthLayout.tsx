
import { Outlet } from "react-router-dom"


const AuthLayout = () => {
  return (
    <>
    <div className="flex h-screen">
      <div className="w-full md:flex">

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>
      </div>
    </div>
    </>
  )
}

export default AuthLayout