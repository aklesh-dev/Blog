import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
    return (
        <section className="flex flex-col sm:flex-row border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
            <div className="flex-1 p-7">
                <h2 className='text-2xl font-semibold'>
                    Want to learn more about Javascript?
                </h2>
                <p className='text-slate-500 my-4'>
                    Checkout this resources with codementor projects.
                </p>
                <Button gradientDuoTone={'purpleToPink'}>
                    <a href="https://www.codementor.io/projects" target='_blank' rel='noopener noreferrer'>
                        Code mentor
                    </a>
                </Button>
            </div>

            <div className="p-7 flex-1">
                <img src="https://www.squash.io/wp-content/uploads/2023/11/javascript-series.jpg" className="rounded-md shadow-md" />
            </div>
        </section>
    )
}
