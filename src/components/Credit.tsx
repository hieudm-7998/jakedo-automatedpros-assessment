export default function Credit() {
  return (
    <div className='bg-white brand-shadow mx-auto mt-6 p-8 border-2 rounded w-full max-w-2/3 text-center'>
      <p className='text-xl'>
        Rick & Morty Database by <span className='italic'>Jake Do</span>
      </p>
      <a
        href='https://jakedo-portfolio.vercel.app/'
        target='_blank'
        rel='noopener noreferrer'
        className="block hover:underline"
      >
        https://jakedo-portfolio.vercel.app/
      </a>
      <a
        href='mailto:jakedo.developer@gmail.com'
        target='_blank'
        rel='noopener noreferrer'
        className="block mb-4 hover:underline"
      >
        jakedo.developer@gmail.com
      </a>
      <p className='text-gray-500 text-sm'>
        Data provided by{' '}
        <a
          href='https://rickandmortyapi.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-[var(--main-color)] hover:underline'
        >
          Rick and Morty API
        </a>
      </p>
    </div>
  );
}
