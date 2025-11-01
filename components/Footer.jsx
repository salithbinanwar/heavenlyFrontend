import { CiMail } from 'react-icons/ci'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="mb-4 md:mb-0 text-lg font-semibold">
            Heavenly &copy; {currentYear}
          </p>
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-md">Developed by Salith Bin Anwar</p>
            <div className="flex items-center space-x-2">
              <CiMail className="text-xl text-blue-400" />
              <p className="text-sm">Email: salithanwar69@gmail.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaGithub className="text-xl text-gray-400" />
              <p className="text-sm">
                Github:{' '}
                <a
                  target="_blank"
                  href="https://github.com/salithbinanwar"
                  className="text-blue-400 hover:underline"
                  rel="noopener noreferrer"
                >
                  salithbinanwar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
