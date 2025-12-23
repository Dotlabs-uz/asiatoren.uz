import { FormClient } from "../client/FormClient";

export const Form = () => {
    return (
        <section className="relative w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white overflow-hidden">
            {/* Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto">
                <FormClient />
            </div>
        </section>
    );
};