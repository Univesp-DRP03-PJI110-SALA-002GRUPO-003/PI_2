import React, { useState, useRef, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Form, Button, Image } from 'react-bootstrap';

type ImageInputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  defaultImage?: string;
};

const ImageInput: React.FC<ImageInputProps> = ({
  name,
  label,
  isRequired = false,
  defaultImage = '',
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(defaultImage);
  const currentValue = watch(name);
  const error = errors[name]?.message as string | undefined;

  useEffect(() => {
    if (typeof currentValue === 'string') {
      setPreview(currentValue);

    } else if (currentValue instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(currentValue);
    }
  }, [currentValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setValue(name, null, { shouldValidate: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setValue(name, file, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview('');
    setValue(name, '', { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>
        {label} {isRequired && <span className="text-danger">*</span>}
      </Form.Label>

      <div className="d-flex flex-column align-items-start">
        {preview ? (
          <div className="mb-3 position-relative">
            <Image
              src={preview}
              alt="Preview"
              roundedCircle
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                border: `2px solid ${error ? '#dc3545' : '#dee2e6'}`,
              }}
            />
            <Button
              variant="danger"
              size="sm"
              className="position-absolute top-0 end-0 rounded-circle"
              onClick={handleRemoveImage}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="icon-bin" />
            </Button>
          </div>
        ) : (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#f8f9fa',
              border: `2px dashed ${error ? '#dc3545' : '#dee2e6'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            {/* Placeholder icon */}
          </div>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button
                variant="outline-primary"
                onClick={() => fileInputRef.current?.click()}
                className={error ? 'border-danger' : ''}
              >
                {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </Button>
              <Form.Control
                {...field}
                type="hidden"
                value={field.value || ''}
              />
            </>
          )}
        />

        {error && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {error}
          </Form.Control.Feedback>
        )}
      </div>
    </Form.Group>
  );
};

export default ImageInput;