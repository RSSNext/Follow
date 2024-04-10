import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="h-10 drag-region shrink-0 absolute top-0 inset-x-0" aria-hidden></div>
      <Outlet />
    </>
  )
}

export default App
