"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { ThreadValidation } from "@/lib/validations/thread";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";

const PostThread = ({ userId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-10 flex w-full flex-col gap-8"
    >
      <FieldGroup>
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-3"
            >
              <FieldLabel className="text-base font-semibold text-light-2">
                Content
              </FieldLabel>

              <Textarea
                {...field}
                rows={15}
                placeholder="What's happening?"
                aria-invalid={fieldState.invalid}
                className="
                  no-focus
                  min-h-[300px]
                  rounded-2xl
                  border
                  border-dark-4
                  bg-dark-3
                  px-4
                  py-3
                  text-base
                  text-light-1
                  placeholder:text-light-4
                  focus-visible:ring-1
                  focus-visible:ring-primary-500
                "
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="
          w-fit
          rounded-xl
          bg-primary-500
          px-6
          py-2
          text-base
          font-semibold
          text-white
          hover:bg-primary-500
        "
      >
        Post Thread
      </Button>
    </form>
  );
};

export default PostThread;
