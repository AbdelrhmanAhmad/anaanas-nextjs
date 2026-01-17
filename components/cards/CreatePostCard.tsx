'use client'
import Image from 'next/image'
import {
  Button,
  Card,
  Col,
  Row,
} from 'react-bootstrap'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import avatar3 from '@/assets/images/avatar/03.jpg'
import Link from 'next/link'
import Select from 'react-select'
import { useRouter } from 'next/navigation'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { fetchCategoriesBySectionId, type Category } from '@/lib/api/categories'
import { fetchFields, fetchSubFields, type Field, type SubField, type AttributeOption } from '@/lib/api/fields'
import { useAppData } from '@/context/AppDataContext'
import type { Section } from '@/lib/api/sections'
import { createPost, deletePostImage, updatePost, type CreatePostData } from '@/lib/api/posts'
import { useSession } from 'next-auth/react'
import LoginRequiredDialog from '@/components/dialogs/LoginRequiredDialog'
import DropzoneFormInput from '../form/DropzoneFormInput'
import { BsImages } from 'react-icons/bs'
import { useParams } from 'next/navigation'

type CreatePostCardProps = {
  mode?: 'create' | 'edit'
  initialPost?: any
  postId?: number | string
  locale?: string
}

const CreatePostCard = ({ mode = 'create', initialPost, postId, locale: localeProp }: CreatePostCardProps) => {
  // الحصول على الجلسة أولاً
  const { data: session, status } = useSession()
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const router = useRouter()
  const params = useParams<{ locale?: string }>()
  const isEdit = mode === 'edit'
  
  // Get locale from prop, params, or default to 'ar'
  const locale = localeProp || (Array.isArray(params?.locale) ? params.locale[0] : params?.locale) || 'ar'

  const initialSectionId = Number(initialPost?.section_id ?? initialPost?.section?.id ?? 0) || null
  const initialCategoryId = Number(initialPost?.category_id ?? initialPost?.category?.id ?? 0) || null
  const initialCountryId = Number(initialPost?.country_id ?? 0) || null
  const initialCityId = Number(initialPost?.city_id ?? 0) || null
  const initialPrice = initialPost?.price != null ? Number(initialPost.price) : null

  const initialAttributes = useMemo(() => {
    if (!isEdit) return [] as Array<{ attributeId: number; optionId: number | number[] }>
    const raw = initialPost?.post_data?.attributes ?? initialPost?.post_data?.attributes ?? initialPost?.attributes
    if (!raw) return []
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return Array.isArray(raw) ? raw : []
  }, [isEdit, initialPost])

const [step, setStep] = useState(1)
  const [subStep, setSubStep] = useState(1)
  const FIELDS_PER_SUBSTEP = 5

  // استخدام Context للبيانات المشتركة
  const {
    sections,
    loadingSections,
    countries,
    loadingCountries,
    selectedCountry,
    setSelectedCountry,
    cities,
    loadingCities,
  } = useAppData()

  // Debug: التحقق من بيانات المدن
  useEffect(() => {
    console.log('CreatePostCard - Cities state:', {
      cities,
      citiesLength: cities?.length,
      loadingCities,
      selectedCountry,
      isArray: Array.isArray(cities),
    })
  }, [cities, loadingCities, selectedCountry])

  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [sectionCategories, setSectionCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [loadingFields, setLoadingFields] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [nestedFields, setNestedFields] = useState<Record<string, SubField[]>>({})
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [dropzoneKey, setDropzoneKey] = useState(0)
  const [didPrefillAttributes, setDidPrefillAttributes] = useState(false)
  const [existingImages, setExistingImages] = useState<Array<{ id: number | string; url: string }>>(() => {
    if (!isEdit) return []
    const arr = Array.isArray((initialPost as any)?.post_images) ? (initialPost as any).post_images : []
    return arr
      .map((img: any) => ({
        id: img?.id,
        url: img?.image_full_url || img?.image,
      }))
      .filter((x: any) => x.id != null && x.url)
  })
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  
  // مرجع للمكون الرئيسي لعمل scroll to top
  const cardRef = useRef<HTMLDivElement>(null)

  // إنشاء schema ديناميكي للـ validation
  const validationSchema = useMemo(() => {
    const schema: Record<string, any> = {}

    // Step 1: validation للعنوان والوصف
    if (step === 1) {
      schema.title = yup.string().required('يرجى إدخال عنوان الإعلان')
      schema.description = yup.string().required('يرجى إدخال وصف الإعلان')
    }

    // Step 3: validation لاختيار القسم
    if (step === 3) {
      schema.section_id = yup.number().required('يرجى اختيار القسم')
    }

    // Step 4: validation لاختيار الفئة
    if (step === 4) {
      schema.section_id = yup.number().required('يرجى اختيار القسم')
      schema.category_id = yup.number().required('يرجى اختيار الفئة')
    }

    // إضافة validation للحقول الديناميكية
    const addFieldValidation = (field: Field | SubField) => {
      // تجنب إضافة نفس الحقل مرتين
      if (schema[field.key_name]) return

      if (field.required) {
        if (field.input_type === 'select' && field.multiselect) {
          schema[field.key_name] = yup.array().min(1, `${field.name} مطلوب`).required(`${field.name} مطلوب`)
        } else if (field.input_type === 'number') {
          schema[field.key_name] = yup.number().required(`${field.name} مطلوب`)
        } else {
          schema[field.key_name] = yup.string().required(`${field.name} مطلوب`)
        }
      } else {
        if (field.input_type === 'select' && field.multiselect) {
          schema[field.key_name] = yup.array().optional()
        } else if (field.input_type === 'number') {
          schema[field.key_name] = yup.number().optional()
        } else {
          schema[field.key_name] = yup.string().optional()
        }
      }
    }

    // إضافة validation لجميع الحقول الرئيسية (فقط في step 5)
    if (step === 5) {
      fields.forEach(addFieldValidation)

      // إضافة validation للحقول المتداخلة (sub-fields)
      const processedSubFields = new Set<string>()
      Object.values(nestedFields).forEach((subFieldsArray) => {
        if (Array.isArray(subFieldsArray)) {
          subFieldsArray.forEach((subField) => {
            if (!processedSubFields.has(subField.key_name)) {
              addFieldValidation(subField)
              processedSubFields.add(subField.key_name)
            }
          })
        }
      })
    }

    // Step 6: validation للمدينة والسعر
    if (step === 6) {
      schema.city = yup.string().required('يرجى اختيار المدينة').nullable()
      schema.price = yup
        .number()
        .typeError('يرجى إدخال رقم صحيح')
        .min(0, 'السعر يجب أن يكون أكبر من أو يساوي 0')
        .required('يرجى إدخال السعر')
        .nullable()
    }

    return yup.object(schema)
  }, [fields, nestedFields, step])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      section_id: undefined,
      category_id: undefined,
      city: undefined,
      price: undefined,
    },
  })

  // Prefill basic fields in edit mode
  useEffect(() => {
    if (!isEdit || !initialPost) return

    const nextTitle = String(initialPost?.title ?? '')
    const nextDescription = String(initialPost?.description ?? '')
    setTitle(nextTitle)
    setDescription(nextDescription)
    setValue('title', nextTitle, { shouldValidate: false })
    setValue('description', nextDescription, { shouldValidate: false })

    if (initialPrice != null) {
      setFormValues((prev) => ({ ...prev, price: String(initialPrice) }))
      setValue('price', initialPrice, { shouldValidate: false })
    }
    if (initialCityId != null && initialCityId > 0) {
      setFormValues((prev) => ({ ...prev, city: String(initialCityId) }))
      setValue('city', String(initialCityId), { shouldValidate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialPost])

  // Ensure city select shows once cities are loaded
  useEffect(() => {
    if (!isEdit) return
    if (!initialCityId || Number(initialCityId) <= 0) return
    if (!Array.isArray(cities) || cities.length === 0) return

    setFormValues((prev) => ({ ...prev, city: String(initialCityId) }))
    setValue('city', String(initialCityId), { shouldValidate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialCityId, cities])

  // Prefill locked section/category/country in edit mode (do NOT allow changing them)
  useEffect(() => {
    if (!isEdit || !initialPost) return

    if (initialCountryId && Array.isArray(countries) && countries.length > 0) {
      const found = countries.find((c) => Number(c.id) === Number(initialCountryId))
      if (found) setSelectedCountry(found)
    }

    if (initialSectionId && Array.isArray(sections) && sections.length > 0 && !selectedSection) {
      const foundSection = sections.find((s) => Number(s.id) === Number(initialSectionId))
      if (foundSection) {
        setSelectedSection(foundSection)
        setValue('section_id', foundSection.id, { shouldValidate: false })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialPost, initialCountryId, countries, initialSectionId, sections])

  useEffect(() => {
    if (!isEdit || !initialPost) return
    if (!initialCategoryId) return
    if (selectedCategory) return
    if (!Array.isArray(sectionCategories) || sectionCategories.length === 0) return

    const foundCategory = sectionCategories.find((c) => Number(c.id) === Number(initialCategoryId))
    if (foundCategory) {
      setSelectedCategory(foundCategory)
      setValue('category_id', foundCategory.id, { shouldValidate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialPost, initialCategoryId, sectionCategories])

  // إعادة تهيئة الأخطاء عند تغيير step
  useEffect(() => {
    clearErrors()
  }, [step, clearErrors])

  // عمل scroll to top عند تغيير step
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  // إعادة تهيئة الـ form عند تغيير القسم أو الفئة
  useEffect(() => {
    if (isEdit) return
    // إعادة تعيين القيم والحقول المتداخلة عند تغيير القسم
    if (selectedSection) {
      setFormValues({})
      setNestedFields({})
      reset()
      setSubStep(1)
    }
  }, [selectedSection?.id, reset])

  useEffect(() => {
    if (isEdit) return
    // إعادة تعيين القيم والحقول المتداخلة عند تغيير الفئة
    if (selectedCategory) {
      setFormValues({})
      setNestedFields({})
      reset()
      setSubStep(1)
    }
  }, [selectedCategory?.id, reset])

  // جلب الـ categories عند اختيار section
  useEffect(() => {
    if (selectedSection) {
      const loadCategories = async () => {
        setLoadingCategories(true)
        try {
          const categoriesData = await fetchCategoriesBySectionId(selectedSection.id, locale)
          setSectionCategories(categoriesData)
        } catch (error) {
          console.error('Error fetching categories:', error)
        } finally {
          setLoadingCategories(false)
        }
      }
      loadCategories()
    }
  }, [selectedSection])

  // جلب الحقول عند الوصول لـ step 4
  useEffect(() => {
    if (step === 5 && selectedSection && selectedCategory) {
      const loadFields = async () => {
        setLoadingFields(true)
        try {
          const fieldsData = await fetchFields(selectedSection.id, selectedCategory.id, locale)
          setFields(fieldsData)
          setSubStep(1) // إعادة تعيين sub-step عند تحميل الحقول
        } catch (error) {
          console.error('Error fetching fields:', error)
        } finally {
          setLoadingFields(false)
        }
      }
      loadFields()
    }
  }, [step, selectedSection, selectedCategory])

  // Prefill dynamic attribute fields in edit mode once fields are loaded (including nested sub-fields)
  useEffect(() => {
    if (!isEdit || didPrefillAttributes) return
    if (!initialPost) return
    if (!Array.isArray(initialAttributes) || initialAttributes.length === 0) {
      setDidPrefillAttributes(true)
      return
    }
    if (!Array.isArray(fields) || fields.length === 0) return

    const attrs = initialAttributes

    const getAttrForFieldId = (fieldId: number) => {
      return attrs.find((a: any) => Number(a?.attributeId) === Number(fieldId))
    }

    const prefillOne = async (field: Field | SubField, parentPath: string) => {
      const attr = getAttrForFieldId(field.id)
      if (!attr) return

      const fieldKey = field.key_name
      const currentPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey
      const nestedKey = `${currentPath}_${field.id}`

      const optionId = (attr as any).optionId
      const value = Array.isArray(optionId) ? optionId.map((x: any) => String(x)) : String(optionId)

      setFormValues((prev) => ({ ...prev, [fieldKey]: value }))
      try {
        setValue(fieldKey, value as any, { shouldValidate: false, shouldDirty: false })
      } catch {
        // ignore
      }

      // Only single-select fields can have nested sub-fields in the current backend model
      if (Array.isArray(optionId)) return
      const optionIdNum = Number(optionId)
      if (!optionIdNum) return

      const selectedOpt = (field as any)?.attributeOptions?.find((o: any) => Number(o?.id) === optionIdNum)
      const childrenCount = Number(selectedOpt?.children_count ?? 0)
      if (childrenCount <= 0) return

      const subFieldsKey = `${nestedKey}_${optionIdNum}`
      const subFields = await loadSubFields(optionIdNum, field.id, subFieldsKey)
      if (!Array.isArray(subFields) || subFields.length === 0) return

      for (const subField of subFields) {
        await prefillOne(subField, currentPath)
      }
    }

    ;(async () => {
      try {
        for (const f of fields) {
          await prefillOne(f, '')
        }
      } finally {
        setDidPrefillAttributes(true)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, didPrefillAttributes, fields, initialAttributes, initialPost])

  // دالة لجلب الخيارات الفرعية
  const loadSubFields = async (optionId: number, attributeId: number, nestedKey: string) => {
    try {
      console.log('Loading subfields for:', { optionId, attributeId, nestedKey })
      const subFieldsData = await fetchSubFields(optionId, attributeId, locale)
      console.log('Subfields loaded:', subFieldsData)
      setNestedFields((prev) => {
        const updated = {
          ...prev,
          [nestedKey]: subFieldsData,
        }
        console.log('Updated nestedFields:', updated)
        return updated
      })
      return subFieldsData
    } catch (error) {
      console.error('Error fetching subfields:', error)
      return []
    }
  }

  // دالة لإزالة جميع التفرعات والتفرعات الفرعية بشكل متكرر
  const clearAllNestedFields = (baseKey: string) => {
    setNestedFields((prev) => {
      const newFields = { ...prev }
      // إزالة جميع المفاتيح التي تبدأ بـ baseKey
      Object.keys(newFields).forEach((key) => {
        if (key.startsWith(baseKey)) {
          delete newFields[key]
          // إزالة التفرعات الفرعية بشكل متكرر
          clearNestedFieldsRecursive(key, newFields)
        }
      })
      return newFields
    })
  }

  // دالة مساعدة لإزالة التفرعات بشكل متكرر
  const clearNestedFieldsRecursive = (parentKey: string, fields: Record<string, SubField[]>) => {
    Object.keys(fields).forEach((key) => {
      if (key.startsWith(`${parentKey}_`)) {
        delete fields[key]
        clearNestedFieldsRecursive(key, fields)
      }
    })
  }

  // دالة لإزالة جميع القيم الفرعية بشكل متكرر
  const clearAllNestedValues = (fieldKey: string) => {
    setFormValues((prev) => {
      const newValues = { ...prev }
      // إزالة جميع القيم التي تبدأ بـ fieldKey
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${fieldKey}.`) || key === fieldKey) {
          delete newValues[key]
        }
      })
      return newValues
    })
  }

  // دالة لتحديث قيمة الحقل وإزالة الحقول الفرعية التابعة
  const handleFieldChange = (fieldKey: string, value: any, currentPath: string = '', shouldClearNested: boolean = true) => {
    setFormValues((prev) => {
      const newValues = { ...prev }
      // إزالة جميع القيم الفرعية التابعة لهذا الحقل
      Object.keys(newValues).forEach((key) => {
        if (key.startsWith(`${fieldKey}.`)) {
          delete newValues[key]
        }
      })
      newValues[fieldKey] = value
      return newValues
    })

    // تحديث react-hook-form
    try {
      setValue(fieldKey, value, { shouldValidate: true, shouldDirty: true })
    } catch (error) {
      // تجاهل الأخطاء إذا كان الحقل غير موجود في schema
      console.warn(`Field ${fieldKey} not in schema:`, error)
    }

    // إزالة الحقول الفرعية من nestedFields فقط إذا كان يجب ذلك
    if (shouldClearNested && currentPath) {
      const keysToRemove = Object.keys(nestedFields).filter((key) => key.startsWith(`${currentPath}_`))
      if (keysToRemove.length > 0) {
        setNestedFields((prev) => {
          const newFields = { ...prev }
          keysToRemove.forEach((key) => delete newFields[key])
          return newFields
        })
      }
    }
  }

  // دالة لإرسال البيانات
  const onSubmit = async (data: any) => {
    if (!selectedSection || !selectedCategory) {
      setSubmitError('يرجى اختيار القسم والفئة')
      return
    }

    if (!formValues.city || !formValues.price) {
      setSubmitError('يرجى اختيار المدينة وإدخال السعر')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // جمع جميع القيم بما فيها المتداخلة في شكل array
      const attributes: Array<{ attributeId: number; optionId: number | number[] }> = []

      // دالة مساعدة لإضافة attribute (للمفرد)
      const addAttribute = (attributeId: number, optionId: number | string) => {
        const optionIdNum = typeof optionId === 'string' ? parseInt(optionId) : optionId
        if (!isNaN(optionIdNum)) {
          attributes.push({
            attributeId,
            optionId: optionIdNum,
          })
        }
      }

      // دالة مساعدة لإضافة attribute (للمتعدد - multiselect)
      const addMultiAttribute = (attributeId: number, optionIds: (string | number)[]) => {
        const optionIdsNum = optionIds
          .map((id) => (typeof id === 'string' ? parseInt(id) : id))
          .filter((id) => !isNaN(id))

        if (optionIdsNum.length > 0) {
          attributes.push({
            attributeId,
            optionId: optionIdsNum,
          })
        }
      }

      // إضافة الحقول الرئيسية
      fields.forEach((field) => {
        const fieldKey = field.key_name
        const value = formValues[fieldKey]

        if (value !== undefined && value !== null && value !== '') {
          // للحقول التي لها خيارات (select, radio, multiselect)
          if (field.input_type === 'select' || field.input_type === 'radio') {
            if (field.multiselect && Array.isArray(value)) {
              // multiselect: إضافة attribute واحد مع array من optionIds
              addMultiAttribute(field.id, value)
            } else if (!field.multiselect && typeof value === 'string') {
              // select/radio عادي: إضافة خيار واحد
              addAttribute(field.id, value)
            }
          }
          // للحقول النصية (text, textarea, number) - نتجاهلها لأنها لا تحتوي على optionId
        }
      })

      // إضافة الحقول المتداخلة (sub-fields)
      Object.keys(nestedFields).forEach((nestedKey) => {
        const subFields = nestedFields[nestedKey]
        if (Array.isArray(subFields)) {
          subFields.forEach((subField) => {
            const value = formValues[subField.key_name]
            if (value !== undefined && value !== null && value !== '') {
              // للحقول التي لها خيارات (select, radio, multiselect)
              if (subField.input_type === 'select' || subField.input_type === 'radio') {
                if (subField.multiselect && Array.isArray(value)) {
                  // multiselect: إضافة attribute واحد مع array من optionIds
                  addMultiAttribute(subField.id, value)
                } else if (!subField.multiselect && typeof value === 'string') {
                  // select/radio عادي: إضافة خيار واحد
                  addAttribute(subField.id, value)
                }
              }
              // للحقول النصية (text, textarea, number) - نتجاهلها لأنها لا تحتوي على optionId
            }
          })
        }
      })

      if (!selectedCountry) {
        setSubmitError('يرجى تحديد الدولة أولاً')
        setIsSubmitting(false)
        return
      }

      const postData: CreatePostData = {
        section_id: selectedSection.id,
        category_id: selectedCategory.id,
        city_id: parseInt(formValues.city),
        country_id: selectedCountry.id,
        price: parseFloat(formValues.price),
        description: description || undefined,
        title: title || undefined,
        attributes,
      }

      console.log('Sending post data:', postData)
      
      // الحصول على التوكن من الجلسة
      const accessToken = session?.accessToken
      if (!accessToken) {
        setSubmitError('يرجى تسجيل الدخول أولاً')
        setIsSubmitting(false)
        return
      }

      const response = isEdit && postId ? await updatePost(postId, postData, accessToken, images) : await createPost(postData, accessToken, images)
      console.log('Post response:', response)

      if (response.success) {
        if (isEdit && postId) {
          alert('تم تعديل الإعلان بنجاح!')
          const nextLocale = locale || (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '')
          const target = nextLocale ? `/${nextLocale}/post/${postId}` : `/post/${postId}`
          router.push(target)
          return
        }

        // نجح الإرسال - إعادة تعيين النموذج
        setFormValues({})
        setNestedFields({})
        setDescription('')
        setTitle('')
        setSelectedSection(null)
        setSelectedCategory(null)
        setFields([])
        setSubStep(1)
        setStep(1)
        setImages([])
        setDropzoneKey((prev) => prev + 1)
        reset()
        // يمكن إضافة toast notification هنا
        alert('تم إرسال الإعلان بنجاح!')
      } else {
        setSubmitError(response.message || 'حدث خطأ أثناء حفظ البيانات')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال البيانات')
    } finally {
      setIsSubmitting(false)
    }
  }

  // مكون لعرض الحقل مع دعم الخيارات المتداخلة
  const renderField = (
    field: Field | SubField,
    level: number = 0,
    parentPath: string = ''
  ) => {
    const fieldKey = field.key_name
    const currentPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey
    const value = formValues[fieldKey]
    const nestedKey = `${currentPath}_${field.id}`

    const fieldError = errors[fieldKey]

    return (
      <div key={`${field.id}_${currentPath}`}
       className={`mb-3 ${level > 0 ? 'ms-4 border-start ps-3 border-primary' : ''}`}>
        <label className="form-label">
          {field.name}
          {field.required && <span className="text-danger">*</span>}
        </label>
        {fieldError && (
          <div className="text-danger small mb-1">{fieldError.message as string}</div>
        )}

        {field.input_type === 'select' && (
          <Select
            options={field.attributeOptions?.map((option) => ({
              value: option.id.toString(),
              label: option.name,
            }))}
            value={
              field.multiselect
                ? field.attributeOptions
                  ?.filter((opt) => {
                    const val = Array.isArray(value) ? value : []
                    return val.includes(opt.id.toString())
                  })
                  .map((opt) => ({
                    value: opt.id.toString(),
                    label: opt.name,
                  })) || []
                : field.attributeOptions?.find((opt) => opt.id.toString() === value)
                  ? {
                    value: value,
                    label: field.attributeOptions.find((opt) => opt.id.toString() === value)?.name || '',
                  }
                  : null
            }
            onChange={async (selectedOption) => {
              // إذا تم إلغاء التحديد (null)
              if (!selectedOption) {
                // إزالة جميع التفرعات والتفرعات الفرعية بشكل متكرر
                clearAllNestedFields(nestedKey)
                clearAllNestedValues(fieldKey)
                handleFieldChange(fieldKey, field.multiselect ? [] : null, nestedKey, false)
                return
              }

              // معالجة القيمة المختارة
              let selectedValue: string | string[] | null
              let selectedOptionValue: string | null = null

              if (field.multiselect) {
                // في حالة multiselect
                if (Array.isArray(selectedOption)) {
                  selectedValue = selectedOption.map((opt) => opt.value)
                } else {
                  selectedValue = []
                }
              } else {
                // في حالة select عادي
                const singleOption = selectedOption as { value: string; label: string } | null
                if (singleOption && !Array.isArray(singleOption)) {
                  selectedValue = singleOption.value
                  selectedOptionValue = singleOption.value
                } else {
                  selectedValue = null
                }
              }

              // إزالة الحقول الفرعية القديمة إذا تم تغيير الاختيار
              if (value && value !== selectedValue) {
                if (field.multiselect) {
                  // في حالة multiselect، إزالة الخيارات التي لم تعد محددة
                  const oldValues = Array.isArray(value) ? value : []
                  const newValues = Array.isArray(selectedValue) ? selectedValue : []
                  oldValues.forEach((oldVal) => {
                    if (!newValues.includes(oldVal)) {
                      const oldSubFieldsKey = `${nestedKey}_${oldVal}`
                      clearAllNestedFields(oldSubFieldsKey)
                    }
                  })
                } else {
                  const oldSubFieldsKey = `${nestedKey}_${value}`
                  clearAllNestedFields(oldSubFieldsKey)
                }
              }

              // تحديث القيمة أولاً
              handleFieldChange(fieldKey, selectedValue, nestedKey, false)

              // إذا كان هناك خيارات فرعية، جلبها
              if (!field.multiselect && selectedOptionValue) {
                const selectedOpt = field.attributeOptions?.find(
                  (opt) => opt.id.toString() === selectedOptionValue
                )
                console.log('Selected option:', selectedOpt)
                if (selectedOpt) {
                  console.log('Children count:', selectedOpt.children_count)
                  if (selectedOpt.children_count && selectedOpt.children_count > 0) {
                    const subFieldsKey = `${nestedKey}_${selectedOptionValue}`
                    console.log('Loading subfields with key:', subFieldsKey)
                    await loadSubFields(selectedOpt.id, field.id, subFieldsKey)
                  } else {
                    console.log('No children for this option')
                  }
                } else {
                  console.log('Option not found')
                }
              }
            }}
            isMulti={field.multiselect}
            isSearchable={true}
            isClearable={true}
            placeholder={`اختر ${field.name}`}
            noOptionsMessage={() => 'لا توجد خيارات متاحة'}
            className="react-select-container"
            classNamePrefix="react-select"
            required={field.required}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '38px',
              }),
            }}
          />
        )}

        {field.input_type === 'radio' && (
          <div className="d-flex flex-wrap gap-2">
            {field.attributeOptions?.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`btn btn-lg ${value === option.id.toString()
                  ? 'btn-primary shadow-sm'
                  : 'btn-outline-primary'
                  }`}
                style={{
                  minWidth: '120px',
                  transition: 'all 0.3s ease',
                  borderWidth: value === option.id.toString() ? '2px' : '1px',
                  fontWeight: value === option.id.toString() ? '600' : '400',
                }}
                onClick={async () => {
                  const selectedValue = option.id.toString()

                  // إزالة الحقول الفرعية القديمة إذا تم تغيير الاختيار
                  if (value && value !== selectedValue) {
                    const oldSubFieldsKey = `${nestedKey}_${value}`
                    clearAllNestedFields(oldSubFieldsKey)
                  }

                  // تحديث القيمة أولاً
                  handleFieldChange(fieldKey, selectedValue, nestedKey, false)

                  // إذا كان هناك خيارات فرعية، جلبها
                  if (selectedValue) {
                    const selectedOpt = field.attributeOptions?.find(
                      (opt) => opt.id.toString() === selectedValue
                    )
                    console.log('Selected radio option:', selectedOpt)
                    if (selectedOpt) {
                      console.log('Children count:', selectedOpt.children_count)
                      if (selectedOpt.children_count && selectedOpt.children_count > 0) {
                        const subFieldsKey = `${nestedKey}_${selectedValue}`
                        console.log('Loading subfields with key:', subFieldsKey)
                        await loadSubFields(selectedOpt.id, field.id, subFieldsKey)
                      } else {
                        console.log('No children for this option')
                      }
                    } else {
                      console.log('Option not found')
                    }
                  }
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}

        {field.input_type === 'text' && (
          <input
            type="text"
            className="form-control"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value, nestedKey)}
            required={field.required}
          />
        )}

        {field.input_type === 'textarea' && (
          <textarea
            className="form-control"
            rows={3}
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value, nestedKey)}
            required={field.required}
          />
        )}

        {field.input_type === 'number' && (
          <input
            type="number"
            className="form-control"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value, nestedKey)}
            required={field.required}
          />
        )}

        {/* عرض الخيارات الفرعية إذا كانت موجودة */}
        {value && (() => {
          const lookupKey = `${nestedKey}_${value}`
          const subFields = nestedFields[lookupKey]
          console.log('Rendering nested fields:', {
            value,
            nestedKey,
            lookupKey,
            availableKeys: Object.keys(nestedFields),
            found: subFields,
          })
          return subFields?.map((subField) =>
            renderField(subField, level + 1, currentPath)
          )
        })()}
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <Card className="card-body cursor-pointer" onClick={() => setShowLoginAlert(true)}>
          <div className="d-flex">
            <div className="avatar avatar-xs me-2">
              <span role="button">
                {' '}
                <Image className="avatar-img rounded-circle" src={avatar3} alt="avatar3" />{' '}
              </span>
            </div>

            <form className="w-100 position-relative z-1">
              <div className=" cursor-pointer 
              "  style={{position: 'absolute'  , zIndex: 1 ,  left: 0, right: 0,  top: 0, bottom: 0, }}  onClick={() => setShowLoginAlert(true)}>
              </div>
              <input onClick={() => setShowLoginAlert(true)}
                className="form-control pe-4 " style={{position: 'relative' , zIndex: 0}}
                disabled
                data-autoresize
                placeholder="ما الذي تريد الاعلان عنه ؟"
                defaultValue={''}
              />
            </form>
          </div>
        </Card>

        <LoginRequiredDialog
          show={showLoginAlert}
          onHide={() => setShowLoginAlert(false)}
          locale={locale}
        />
      </>
    )
  }

  return (
    <>
      <Card ref={cardRef} className="card-body">
        <div className="d-flex ">
          <div className="avatar avatar-xs me-2">
            <span role="button">
              {' '}
              <Image className="avatar-img rounded-circle" src={avatar3} alt="avatar3" />{' '}
            </span>
          </div>

          {/* شريط التقدم للـ steps الرئيسية */}
          <div className="mb-3  d-none">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">
                الخطوة {step} من 6
              </span>
              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`rounded-circle ${stepNum <= step ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ width: '10px', height: '10px' }}
                  />
                ))}
              </div>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(step / 6) * 100}%`,
                }}
              />
            </div>
          </div>


          <form className="w-100">
{
  step === 1 && (
    <>
                  <div className="mb-3">
                    <label className="form-label">
                      عنوان الإعلان <span className="text-danger">*</span>
                    </label>
                    <input
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      placeholder="ما الذي تريد الاعلان عنه ؟"
                      value={title || ''}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        setValue('title', e.target.value, { shouldValidate: true })
                      }}
                    />
                    {errors.title && (
                      <div className="text-danger small mt-1">{errors.title.message as string}</div>
                    )}
                  </div>
                  {
                    title &&
                    <>

                      <div className="mb-3">
                        <label className="form-label">
                          وصف الإعلان <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          rows={3}
                          name="description"
                          placeholder="اكتب وصف الاعلان"
                          value={description || ''}
                          onChange={(e) => {
                            setDescription(e.target.value)
                            setValue('description', e.target.value, { shouldValidate: true })
                          }}
                          required
                        />
                        {errors.description && (
                          <div className="text-danger small mt-1">{errors.description.message as string}</div>
                        )}
          </div>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div></div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={async () => {
                            const titleValid = await trigger('title')
                            const descriptionValid = await trigger('description')
                            if (titleValid && descriptionValid) {
                              setStep(step + 1)
                            }
                          }}
                        >
                          التالي →
                        </button>
                      </div>



                    </>
                  }


    </>
  )
}
{
  step === 2 && (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <label className="form-label fw-bold mb-2">صور الإعلان</label>
            <p className="text-muted small mb-0">يمكنك رفع حتى 5 صور. يفضّل صور واضحة تبين تفاصيل الإعلان.</p>
          </div>
          {images.length > 0 && (
            <span className="badge bg-light text-dark border">
              {images.length} / 5 صور
            </span>
          )}
        </div>

        {isEdit && existingImages.length > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-semibold">الصور الحالية</div>
              <small className="text-muted">يمكنك حذف الصور القديمة</small>
            </div>
            <div className="row g-2 mt-2">
              {existingImages.map((img) => (
                <div key={String(img.id)} className="col-6 col-md-4 col-lg-3">
                  <div className="border rounded p-2 h-100">
                    <img src={img.url} alt="post image" className="w-100 rounded" style={{ objectFit: 'cover', height: 110 }} />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger w-100 mt-2"
                      disabled={deletingImageId === String(img.id)}
                      onClick={async () => {
                        if (!postId) return
                        const accessToken = session?.accessToken
                        if (!accessToken) {
                          setShowLoginAlert(true)
                          return
                        }
                        const ok = confirm('هل تريد حذف هذه الصورة؟')
                        if (!ok) return
                        try {
                          setDeletingImageId(String(img.id))
                          await deletePostImage(postId, img.id, accessToken)
                          setExistingImages((prev) => prev.filter((x) => String(x.id) !== String(img.id)))
                        } catch (e) {
                          console.error('Delete image failed', e)
                          alert(e instanceof Error ? e.message : 'فشل حذف الصورة')
                        } finally {
                          setDeletingImageId(null)
                        }
                      }}
                    >
                      {deletingImageId === String(img.id) ? 'جارٍ الحذف...' : 'حذف'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <DropzoneFormInput
            key={dropzoneKey}
            label=""
            showPreview
            icon={BsImages}
            iconProps={{ className: 'display-4 text-primary' }}
            text="اسحب أو اضغط لرفع الصور (PNG, JPG, JPEG)"
            textClassName="text-muted fw-semibold"
            helpText={
              <ul className="mb-0 small text-muted">
                <li>الحد الأقصى 5 صور.</li>
                <li>سيتم إرفاق الصور مع إرسال الإعلان.</li>
              </ul>
            }
            onFileUpload={(files) => {
              const safeFiles = Array.isArray(files) ? files.slice(0, 5) : []
              setImages(safeFiles)
            }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setStep(1)}
        >
          ← السابق
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setStep(3)}
        >
          التالي →
        </button>
      </div>
    </>
  )
}
{
  step === 3 && (
    <>
<Row className="position-relative">
          <Col xl={12} lg={11} className="mx-auto">
                      <label className="form-label">
                        اختر القسم <span className="text-danger">*</span>
                      </label>
                      {errors.section_id && (
                        <div className="alert alert-danger">
                          {errors.section_id.message as string}
                        </div>
                      )}
                      {isEdit ? (
                        <div className="alert alert-info">
                          لا يمكن تغيير القسم أثناء تعديل المنشور.
                          <div className="mt-2 fw-semibold">{selectedSection?.name || initialPost?.section?.name || '-'}</div>
                        </div>
                      ) : loadingSections ? (
                        <div className="text-center py-4">جاري التحميل...</div>
                      ) : (
                        <div className="d-flex gap-3 mt-4 pb-2 flex-wrap">
                          {sections.map((sectionItem) => (
                            <div
                              key={sectionItem.id}
                              role="button"
                              onClick={async () => {
                                setSelectedSection(sectionItem)
                                setValue('section_id', sectionItem.id, { shouldValidate: true })
                                const isValid = await trigger('section_id')
                                if (isValid) {
                                  setStep(4)
                                }
                              }}
                              className={`card card-body mb-0 p-3 text-center flex-shrink-0 ${selectedSection?.id === sectionItem.id ? 'border-primary border-2' : ''
                                }`}
                              style={{ minWidth: 150, maxWidth: 180, cursor: 'pointer' }}
                            >
                              {sectionItem.icon && (
                                <Image
                                  className="h-40px mb-3 mx-auto"
                                  src={sectionItem.icon}
                                  alt={sectionItem.name}
                                  width={40}
                                  height={40}
                                  unoptimized
                                />
                              )}
                              <h6 className="mb-0">{sectionItem.name}</h6>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setStep(step - 1)}
                        >
                          ← السابق
                        </button>
                        {(selectedSection || isEdit) && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={async () => {
                              if (isEdit) {
                                setStep(4)
                                return
                              }
                              const isValid = await trigger('section_id')
                              if (isValid) setStep(4)
                            }}
                          >
                            التالي →
                          </button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </>
              )
            }
            {
              step === 4 && (
                <>
                  <Row className="position-relative">
                    <Col xl={12} lg={11} className="mx-auto">
                      <label className="form-label">
                        اختر الفئة <span className="text-danger">*</span>
                      </label>
                      {errors.category_id && (
                        <div className="alert alert-danger">
                          {errors.category_id.message as string}
                        </div>
                      )}
                      {isEdit ? (
                        <div className="alert alert-info">
                          لا يمكن تغيير الفئة أثناء تعديل المنشور.
                          <div className="mt-2 fw-semibold">{selectedCategory?.name || initialPost?.category?.name || '-'}</div>
                        </div>
                      ) : loadingCategories ? (
                        <div className="text-center py-4">جاري التحميل...</div>
                      ) : (
                        <>
                          {selectedSection && (
                            <div className="mb-3 p-2 bg-light rounded">
                              <small className="text-muted">القسم المختار:</small>
                              <h6 className="mb-0">{selectedSection.name}</h6>
                            </div>
                          )}
                          <div className="d-flex gap-3 mt-4 pb-2 flex-wrap">
                            {sectionCategories.map((category) => (
                              <div
                  key={category.id}
                                role="button"
                                onClick={async () => {
                                  setSelectedCategory(category)
                                  setValue('category_id', category.id, { shouldValidate: true })
                                  const isValid = await trigger('category_id')
                                  if (isValid) {
                                    setStep(5)
                                  }
                                }}
                                className={`card card-body mb-0 p-3 text-center flex-shrink-0 ${selectedCategory?.id === category.id ? 'border-primary border-2' : ''
                                  }`}
                                style={{ minWidth: 150, maxWidth: 180, cursor: 'pointer' }}
                >
                  {category.icon && (
                    <Image
                      className="h-40px mb-3 mx-auto"
                      src={category.icon}
                      alt={category.name}
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                  <h6 className="mb-0">{category.name}</h6>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedCategory(null)
                            setSectionCategories([])
                            setValue('category_id', undefined)
                            setStep(step - 1)
                          }}
                        >
                          ← السابق
                        </button>
                        {(selectedCategory || isEdit) && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={async () => {
                              if (isEdit) {
                                setStep(5)
                                return
                              }
                              const isValid = await trigger('category_id')
                              if (isValid) setStep(5)
                            }}
                          >
                            التالي →
                          </button>
                        )}
            </div>
          </Col>
        </Row>
                </>
              )
            }
            {
              step === 6 && (
                <>
                  <Row className="position-relative">
                    <Col xl={12} lg={11} className="mx-auto">
                      {selectedSection && selectedCategory && (
                        <div className="mt-4">
                          <div className="mb-4">
                            <h5 className="mb-3">معلومات إضافية</h5>
                            <div className="text-muted small mb-3">
                              <span>القسم: {selectedSection.name}</span>
                              <span className="mx-2">•</span>
                              <span>الفئة: {selectedCategory.name}</span>
                            </div>
                          </div>

                          <form onSubmit={handleSubmit(onSubmit)}>
                            {/* حقل اختيار المدينة */}
                            <div className="mb-4">
                              <label className="form-label">
                                اختر المدينة <span className="text-danger">*</span>
                              </label>
                              {loadingCities ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">جاري التحميل...</span>
                                  </div>
                                  <span className="ms-2">جاري تحميل المدن...</span>
                                </div>
                              ) : cities && Array.isArray(cities) && cities.length > 0 ? (
                                <>
                                  <Select
                                    options={cities.map((city) => ({
                                      value: city.id.toString(),
                                      label: city.name,
                                    }))}
                                    value={
                                      formValues.city
                                        ? {
                                          value: formValues.city,
                                          label: cities.find((c) => c.id.toString() === formValues.city)?.name || '',
                                        }
                                        : null
                                    }
                                    onChange={(selectedOption) => {
                                      const cityValue = selectedOption?.value || null
                                      handleFieldChange('city', cityValue, '', false)
                                      setValue('city', cityValue, { shouldValidate: true })
                                    }}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder="اختر المدينة"
                                    noOptionsMessage={() => 'لا توجد مدن متاحة'}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        minHeight: '38px',
                                        borderColor: errors.city ? '#dc3545' : state.isFocused ? '#86b7fe' : '#ced4da',
                                        '&:hover': {
                                          borderColor: errors.city ? '#dc3545' : '#86b7fe',
                                        },
                                      }),
                                    }}
                                  />
                                  {errors.city && (
                                    <div className="text-danger small mt-1">{errors.city.message as string}</div>
                                  )}
                                </>
                              ) : selectedCountry ? (
                                <div className="alert alert-info">
                                  لا توجد مدن متاحة لهذه الدولة
                                </div>
                              ) : (
                                <div className="alert alert-warning">
                                  يرجى تحديد الدولة أولاً
                                </div>
                              )}
                            </div>

                            {/* حقل السعر */}
                            <div className="mb-4">
                              <label className="form-label">
                                السعر <span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                  placeholder="أدخل السعر"
                                  value={formValues.price || ''}
                                  onChange={(e) => {
                                    const priceValue = e.target.value
                                    handleFieldChange('price', priceValue, '', false)
                                    setValue('price', priceValue ? parseFloat(priceValue) : undefined, { shouldValidate: true })
                                  }}
                                  min="0"
                                  step="0.01"
                                />
                                <span className="input-group-text">ر.س</span>
                              </div>
                              {errors.price && (
                                <div className="text-danger small mt-1">{errors.price.message as string}</div>
                              )}
                              <small className="form-text text-muted">
                                يرجى إدخال السعر بالعملة المحلية
                              </small>
                            </div>

                            {/* عرض أخطاء الإرسال */}
                            {submitError && (
                              <div className="alert alert-danger">
                                {submitError}
        </div>
                            )}

                            {/* أزرار التنقل */}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                  // إعادة تعيين subStep إلى آخر substep
                                  const maxSubStep = Math.ceil(fields.length / FIELDS_PER_SUBSTEP)
                                  setSubStep(maxSubStep > 0 ? maxSubStep : 1)
                                  setStep(5)
                                }}
                              >
                                ← السابق
                              </button>

                              <button
                                type="button"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                onClick={async () => {
                                  // التحقق من city و price قبل الإرسال
                                  const cityValid = await trigger('city')
                                  const priceValid = await trigger('price')
                                  if (cityValid && priceValid) {
                                    handleSubmit(onSubmit)()
                                  } else {
                                    setSubmitError('يرجى تصحيح الأخطاء قبل الإرسال')
                                  }
                                }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                    جاري الإرسال...
                                  </>
                                ) : (
                                  'إرسال'
                                )}
                              </button>
            </div>
            </form>
          </div>
                      )}
                    </Col>
                  </Row>
                </>
              )
            }
            {
              step === 5 && (
                <>
                  <Row className="position-relative">
                    <Col xl={12} lg={11} className="mx-auto">
                      {selectedSection && selectedCategory && (
                        <div className="mt-4">
                          <div className="mb-3">
                            <h6>القسم: {selectedSection.name}</h6>
                            <h6>الفئة: {selectedCategory.name}</h6>
          </div>

                          {loadingFields ? (
                            <div className="text-center py-4">جاري تحميل الحقول...</div>
                          ) : (
                            <>
                              {/* عرض مؤشر التقدم */}
                              {fields.length > FIELDS_PER_SUBSTEP && (
                                <div className="mb-4 d-block mt-5 py-3">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">
                                      الخطوة {subStep} من {Math.ceil(fields.length / FIELDS_PER_SUBSTEP)}
                                    </span>
                                    <div className="d-flex gap-1">
                                      {Array.from({ length: Math.ceil(fields.length / FIELDS_PER_SUBSTEP) }, (_, i) => (
                                        <div
                                          key={i + 1}
                                          className={`rounded-circle ${i + 1 === subStep ? 'bg-primary' : 'bg-secondary'
                                            }`}
                                          style={{ width: '12px', height: '12px' }}
                                        />
                                      ))}
            </div>
          </div>
                                  <div className="progress" style={{ height: '4px' }}>
                                    <div
                                      className="progress-bar"
                                      role="progressbar"
                                      style={{
                                        width: `${(subStep / Math.ceil(fields.length / FIELDS_PER_SUBSTEP)) * 100}%`,
                                      }}
                                    />
          </div>
                                </div>
                              )}

                              <form>
                                {fields
                                  .sort((a, b) => a.sort - b.sort)
                                  .slice((subStep - 1) * FIELDS_PER_SUBSTEP, subStep * FIELDS_PER_SUBSTEP)
                                  .map((field) => renderField(field))}

                                {/* عرض أخطاء الـ validation */}
                                {Object.keys(errors).length > 0 && (
                                  <div className="alert alert-danger mt-3">
                                    <strong>يرجى تصحيح الأخطاء التالية:</strong>
                                    <ul className="mb-0 mt-2">
                                      {Object.entries(errors).map(([key, error]) => (
                                        <li key={key}>
                                          {error?.message as string}
                    </li>
                  ))}
                </ul>
              </div>
                                )}

                                {/* أزرار التنقل */}
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                  {/* زر السابق */}
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      if (subStep > 1) {
                                        // إذا لم تكن substep الأولى، ارجع substep
                                        setSubStep(subStep - 1)
                                      } else {
                                        // إذا كانت substep الأولى، ارجع main step
                                        setSelectedCategory(null)
                                        setFields([])
                                        setFormValues({})
                                        setNestedFields({})
                                        setSubStep(1)
                                        setStep(step - 1)
                                      }
                                    }}
                                  >
                                    ← السابق
                                  </button>

                                  {/* زر التالي أو إرسال */}
                                  {subStep < Math.ceil(fields.length / FIELDS_PER_SUBSTEP) ? (
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={async () => {
                                        // التحقق من الحقول في الـ sub-step الحالي فقط
                                        const currentFields = fields
                                          .sort((a, b) => a.sort - b.sort)
                                          .slice((subStep - 1) * FIELDS_PER_SUBSTEP, subStep * FIELDS_PER_SUBSTEP)

                                        // جمع جميع مفاتيح الحقول (بما فيها المتداخلة)
                                        const fieldKeys: string[] = []
                                        currentFields.forEach((field) => {
                                          fieldKeys.push(field.key_name)
                                          // إضافة الحقول المتداخلة لهذا الحقل
                                          Object.keys(nestedFields).forEach((nestedKey) => {
                                            if (nestedKey.startsWith(`${field.key_name}_`)) {
                                              const subFields = nestedFields[nestedKey]
                                              subFields.forEach((subField) => {
                                                if (!fieldKeys.includes(subField.key_name)) {
                                                  fieldKeys.push(subField.key_name)
                                                }
                                              })
                                            }
                                          })
                                        })

                                        // التحقق فقط من الحقول الحالية (بدون city و price)
                                        const fieldsToValidate = fieldKeys.filter((key) => key !== 'city' && key !== 'price')
                                        const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate)

                                        if (isValid) {
                                          setSubStep(subStep + 1)
                                        }
                                      }}
                                    >
                                      التالي →
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={async () => {
                                        // التحقق من جميع الحقول الديناميكية فقط (بدون city و price)
                                        const allFieldKeys = fields.map((f) => f.key_name)
                                        // إضافة الحقول المتداخلة
                                        Object.values(nestedFields).flat().forEach((subField) => {
                                          if (!allFieldKeys.includes(subField.key_name)) {
                                            allFieldKeys.push(subField.key_name)
                                          }
                                        })

                                        const fieldsToValidate = allFieldKeys.filter((key) => key !== 'city' && key !== 'price')
                                        const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate)

                                        if (isValid) {
                                          setStep(6)
                                        }
                                      }}
                                    >
                                      التالي →
                                    </button>
                                  )}
            </div>
            </form>
                            </>
                          )}
          </div>
                      )}
          </Col>
                  </Row>
                </>
              )
            }


          </form>



        </div>


      </Card>
    </>
  )
}
export default CreatePostCard
