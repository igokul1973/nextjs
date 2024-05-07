import { useEffect } from 'react';
import { FieldErrors } from 'react-hook-form';
import { objectKeys } from '../utils';

export const useScrollToFormError = (
    errors: FieldErrors,
    canFocus: boolean,
    setCanFocus: (canFocus: boolean) => void
) => {
    useEffect(() => {
        if (errors) {
            // Sort inputs based on their position on the page. (the order will be based on validaton order otherwise)
            const errorElements: HTMLElement[] = [];
            const externalErrorKeys = objectKeys(errors);
            for (let i = 0; i < externalErrorKeys.length; i++) {
                const externalErrorName = externalErrorKeys[i];
                if (Array.isArray(errors[externalErrorName])) {
                    const errorsArray = errors[externalErrorName] as unknown as unknown[]; // as (typeof errors)[typeof externalErrorName][];
                    for (let j = 0; j < errorsArray.length; j++) {
                        const arrElement = errorsArray[j] as (typeof errorsArray)[number];
                        if (arrElement) {
                            const internalErrorKeys = objectKeys<typeof arrElement>(arrElement);
                            for (let k = 0; k < internalErrorKeys.length; k++) {
                                const internalErrorName = internalErrorKeys[k];
                                const elementName = `${externalErrorName}.${j}.${internalErrorName}`;
                                const el = document.getElementsByName(elementName)[0];
                                errorElements.push(el);
                            }
                        }
                    }
                } else {
                    errorElements.push(document.getElementsByName(externalErrorName)[0]);
                }
            }
            const filteredErrorElements = errorElements
                .filter((el) => !!el)
                .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

            if (filteredErrorElements.length) {
                const errorElement = filteredErrorElements[0];
                const offset = 150;
                const topOfErrorElement =
                    errorElement.getBoundingClientRect().top + window.scrollY - offset;
                console.log('topOfErrorElement: ', topOfErrorElement);
                window.scrollTo({ top: topOfErrorElement, behavior: 'smooth' });
                errorElement?.focus({ preventScroll: false });
                // scrollIntoView options are not supported in Safari
                // so the form doesn't suddenly jump to the next input that has error.
                setCanFocus(false);
            }
        }
    }, [errors, canFocus, setCanFocus]);
};
