import { CopyIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import { _writeClient, client } from 'lib/sanity.client'
import { groq } from 'next-sanity'
import { useDataset, useDocumentOperation } from 'sanity'

export default function CreateVariant(props) {
  const latestDocument = props?.draft || props?.published
  const dataset = useDataset()

  const _readClientWithConfig = client.withConfig({ dataset })

  // init toast
  const toast = useToast()

  const { patch } = useDocumentOperation(props.id, props.type)

  // useEffect(() => {
  //   // if the isPublishing state was set to true and the draft has changed
  //   // to become `null` the document has been published
  //   if (!props.draft) {
  //     setIsPublishing(false)
  //   }
  // }, [props.draft, setIsPublishing])

  return {
    label: 'Create Variant',
    title: latestDocument?.isVariant
      ? 'You cannot clone a variant. Please clone the original item.'
      : 'Create a Variant of this Item',
    disabled: latestDocument?.isVariant ? true : false,
    icon: CopyIcon,
    onHandle: async () => {
      if (!_writeClient || !_readClientWithConfig || !latestDocument)
        console.error('missing client or doc')

      // determine the next variant number
      const lastVariantNumber =
        ((await _readClientWithConfig.fetch(
          groq`*[_id in $variantIds] | order(variantNumber desc)[0]{
            variantNumber
        }.variantNumber`,
          {
            variantIds: latestDocument?.variants
              ? latestDocument?.variants?.map((v) => v._ref)
              : [],
          }
        )) as number) || 1

      console.log({ lastVariantNumber })

      // draft the new variant document
      const newVariant = {
        ...latestDocument,
        _id: `${latestDocument._id}-variant-${(await lastVariantNumber) + 1}`,
        _type: 'item',
        stock: 1,
        isVariant: true,
        serialNumber: undefined,
        variantNumber: (await lastVariantNumber) + 1,
      }

      const _writeClientWithConfig = _writeClient.withConfig({ dataset })

      toast.push({
        status: 'warning',
        title: 'Attempting to Create Variant',
      })

      try {
        // create the new variant document
        await _writeClientWithConfig
          .create(newVariant)
          .then((res) => {
            console.log({ res })
          })
          .then(() => {
            // update the original document with the new variant
            patch.execute([
              {
                set: {
                  variants: [
                    ...(latestDocument?.variants || []),
                    {
                      _key: uuid(),
                      _type: 'reference',
                      _ref: newVariant._id,
                      _weak: true,
                    },
                  ],
                },
              },
            ])
          })
      } catch (err) {
        console.error(err)

        if (err.message.includes('already exists')) {
          toast.push({
            status: 'error',
            title: 'A variant with this name already exists.',
          })
        } else {
          toast.push({
            status: 'error',
            title:
              'Uh oh, there was a problem creating the variant. Please try again or contact support.',
          })
        }
      } finally {
        toast.push({
          status: 'success',
          title: 'Variant Created Successfully',
        })
        props.onComplete()
      }
    },
  }
}
