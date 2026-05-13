"use client";

import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";
// import { addCommentToThread } from "@/lib/actions/thread.actions";

const Comment = ({ threadId, currentUserImg, currentUserId }) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values) => {
    await addCommentToThread({
      threadId,
      commentText: values.thread,
      userId: currentUserId,
      path: pathname,
    });

    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      // Changed from flex-col to flex-row (items-center) for an inline layout. Added borders for separation.
      className="mt-10 flex items-center gap-4 border-y border-slate-800 py-5 max-xs:flex-col"
    >
      <FieldGroup className="flex w-full flex-1 items-center">
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full items-center gap-3"
            >
              <FieldLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FieldLabel>

              <div className="flex-1">
                <Input
                  {...field}
                  type="text"
                  placeholder="Comment..."
                  aria-invalid={fieldState.invalid}
                  className="
                    no-focus
                    border-none
                    bg-transparent
                    text-light-1
                    outline-none
                    w-full
                  "
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="
          w-fit
          rounded-3xl
          bg-primary-500
          px-8
          py-2
          text-base
          font-semibold
          text-white
          hover:bg-primary-500
          max-xs:w-full
        "
      >
        Reply
      </Button>
    </form>
  );
};

export default Comment;
