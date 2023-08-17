// export default (S, schemaType, ) => S.documentTypeList(schemaType)
//                   .title(`${parent.title}`)
//                   .id(parent._id)
//                   .filter(`_type == $schemaType && parent._ref in $subChildren`)
//                   .params({
//                     schemaType,
//                     parentId: parent._id,
//                     subChildren: subChildren.map(
//                       (subChild: SanityDocument) => subChild._id
//                     ),
//                   })
//                   .canHandleIntent(
//                     (intentName, params) =>
//                       intentName === "create" &&
//                       params.template === "category-child"
//                   )
//                   .initialValueTemplates([
//                     S.initialValueTemplateItem("category-child", {
//                       parentId: parent._id,
//                       title: "test",
//                     }),
//                   ])
