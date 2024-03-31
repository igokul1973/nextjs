import AcmeLogo from '@/app/ui/acme-logo/acme-logo';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
    return (
        <main>
            <div>
                <AcmeLogo />
            </div>
            <div>
                <div>
                    <p>
                        <strong>Welcome to Acme.</strong> This is the example for the{' '}
                        <a href='https://nextjs.org/learn/' className='text-blue-500'>
                            Next.js Learn Course
                        </a>
                        , brought to you by Vercel.
                    </p>
                    <Link href='/login'>
                        <span>Log in</span> <ArrowRight className='w-5 md:w-6' />
                    </Link>
                </div>
                <div>
                    {/* Add Hero Images Here */}
                    <Image
                        src='/hero-desktop.png'
                        width={1000}
                        height={760}
                        alt='Screenshots whatever'
                    />
                    <Image
                        src='/hero-mobile.png'
                        width={560}
                        height={620}
                        alt='Screenshots whatever mobile'
                    />
                </div>
            </div>
            <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur exercitationem,
                unde maiores, asperiores, dolores inventore expedita sit dicta error fugiat
                necessitatibus commodi vero voluptate. Ut quo odit sapiente reprehenderit odio a
                distinctio, magnam saepe dicta quas quos laborum consequuntur repellendus enim,
                optio unde corrupti numquam ipsa culpa aut nostrum minima. Exercitationem nostrum,
                perspiciatis veritatis deleniti cum voluptate qui quod eligendi eius eum aspernatur!
                Animi excepturi quaerat repudiandae ex at labore, consequuntur in eum! Repellat
            </div>
        </main>
    );
}
