import {useForm} from "react-hook-form";
import useEditCabin from "./hooks/useEditCabin.js";
import useCreateCabin from "./hooks/useCreateCabin.js";

import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form.jsx";
import Button from "../../ui/Button.jsx";
import FileInput from "../../ui/FileInput.jsx";
import Textarea from "../../ui/Textarea.jsx";
import PropTypes from "prop-types";
import {useState} from "react";
import Row from "../../ui/Row.js";
import Checkbox from "../../ui/Checkbox.jsx";
import {HiTrash} from "react-icons/hi2";
import useDeletedImages from "./hooks/useDeletedImgs.js";


const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;
const Label = styled.label`
  font-weight: 500;
`;
const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;
const FileList = styled.ul`
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 0.5rem;
`
const File = styled.li`
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
`
const ImgBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
  width: 110px;
  border-radius: 3px;
  overflow: hidden;
`
const TextBox = styled.p`
  display: flex;
  align-items: center;
  margin-left: 20px;
  width:100%;
  word-break: break-word;
  font-style: italic;
  font-size: 12px;
`
const Img = styled.img`
  display: block;
  border-radius: 3px;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
`;
function CreateEditCabinForm({cabinToEdit, onCloseModal}) {
    const editId = cabinToEdit?.id ? cabinToEdit.id : false;
    const editValues = cabinToEdit?.id ? cabinToEdit : null;
    const isEditSession = Boolean(editId);
    const [files, setFiles] = useState(editId? JSON.parse(cabinToEdit.images) : []);
    const [mainImgIndex, setMainImgIndex] = useState(editId? JSON.parse(cabinToEdit.images)[0] : ''); // 0
    const oldFiles = editId? JSON.parse(cabinToEdit.images) : [];
    const [imgsToRemove, setImgsToRemove] = useState([]);


    const {register,
      handleSubmit,
      reset,
      getValues,
      formState}
        = useForm({
      defaultValues: isEditSession ? editValues : {}
    });
    const {isCreating, createCabin} = useCreateCabin();
    const {isEditing, editCabin} = useEditCabin();
    const {isDeletingImages, deleteCabinImages} = useDeletedImages();

    const {errors} = formState;
    const isWorking = isCreating || isEditing || isDeletingImages;
    function onSubmit(data){
        let cabinObj = {...data};
        if(files.length === 0) return;
        /* // 1 nothing changed:
        if(mainImgIndex === 0 && !data.images.length){
            cabinObj = {...data};
        }*/
        if(mainImgIndex !== files[0] || data.images.length > 0){
            let newImages = [];
            // 2 changed only main image (no file was added):
            if(mainImgIndex !== files[0] && data.images.length === 0){
                const mainImageSrc = files[mainImgIndex];
                newImages = files.filter(img => img !== mainImageSrc);
                newImages.unshift(mainImageSrc); // make main image at first place
                // array with strings of existing images
            }
            // 3 added new files but main image the same:
            if(mainImgIndex === files[0] && data.images.length > 0){
                files.forEach(fileName => {
                    const foundFile = [...data.images].find(file => file.name === fileName);
                    newImages.push(foundFile ? foundFile : fileName);
                });
                // array with strings of existing images and new objects (files)
            }
            // 4 added new files and changed main image:
            if(mainImgIndex !== files[0] && data.images.length > 0){
                const mainImageSrc = files[mainImgIndex]; // this string of existing File of added
                const isMainImgNewFile =  [...data.images].find(file => file.name === mainImageSrc);

                if(isMainImgNewFile){ // means that main picture is new file
                    newImages.push(isMainImgNewFile);
                } else{  // means that main picture is existing file
                    newImages.push(mainImageSrc);
                }

                files.forEach(fileName => {
                    if(fileName === mainImageSrc) return; // bc this is already on first place
                    const newFile = [...data.images].find(file=> file.name === fileName);
                    if(newFile){
                        newImages.push(newFile); // add new File
                    }else newImages.push(fileName); // add existing FileSrc
                });
                // array with strings of existing images and new objects (files)
            }
            cabinObj = {...data, images: newImages};
        }
       // const image = typeof data.images === 'string' ? data.images : data.images[0]; // const image = typeof data.image === 'string' ? data.image : data.image[0]; // data.image[0]
        //const cabinObj = {...data, image: image};

      if(isEditSession) editCabin(cabinObj, // editCabin({newCabinData: cabinObj, id: editId},
          {onSuccess: ()=> {
          reset();
          if(imgsToRemove.length > 0){
              deleteCabinImages({collection: imgsToRemove});
          }
          onCloseModal?.();
          }});
      else createCabin(cabinObj, {
          onSuccess: ()=> {
          reset();
          onCloseModal?.();
          }});
    }
    function onError(errors){
      console.log(errors);
    }

    function updateFileList(){
        const images = [...getValues().images];
        const newImages = [];
        images.forEach(image => {
            const found = files.find(file => file.includes(image.name));
            if(!found) newImages.push(image.name);
        });
        if(files.length === 0) setMainImgIndex(newImages[0]);
        setFiles(prev => files.concat(newImages));
    }
    function changeMainImg(selectedImgIndex){
        if(mainImgIndex === selectedImgIndex) return;
        setMainImgIndex(selectedImgIndex);
    }

    function removeImage(imgSrc){
        if(files.length === 1) return;
        const existedImg = [...JSON.parse(cabinToEdit.images)].find(img => img === imgSrc);
        if(existedImg) setImgsToRemove(prev => [...prev, existedImg]);
        const newFiles = files.filter(el => el !== imgSrc);
        if(newFiles.length === 1) setMainImgIndex(newFiles[0]);
        setFiles(prev => [...newFiles]);
    }
    return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}
    type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" disabled={isWorking}
               {...register('name', {
                 required: 'This field is required'
               })}/>
        {errors?.name?.message && <Error>{errors.name.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input type="number" id="maxCapacity" disabled={isWorking}
               {...register('maxCapacity', {
                 required: 'This field is required',
                 min: {
                   value: 1,
                   message: 'Capacity should be al least 1'
                 }
               })} />
        {errors?.maxCapacity?.message && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input type="number" id="regularPrice" disabled={isWorking}
               {...register('regularPrice', {
                 required: 'This field is required',
                 min: {
                   value: 50,
                   message: 'Regular Price should be al least 50'
                 }
               })}/>
        {errors?.regularPrice?.message && <Error>{errors.regularPrice.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input type="number" id="discount" defaultValue={0}
               disabled={isWorking}
               {...register('discount', {
                 required: 'This field is required',
                 validate: (value)=> value <= getValues().regularPrice / 10
                     || 'Discount should not be greater than 10% of the price'
               })}/>
        {errors?.discount?.message && <Error>{errors.discount.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea type="text" id="description" defaultValue=""
                  disabled={isWorking}
                  {...register('description', {
                    required: 'This field is required'
                  })}/>
        {errors?.description?.message && <Error>{errors.description.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="images">Cabin photo</Label>
        <Row>
              {files.length > 0 && (
                  <Row>
                      <Row type='horizontal' style={{justifyContent: 'space-between', width: '100%'}}>
                          <Label>List of uploaded images:</Label>
                          <Label>Check main file:</Label>
                      </Row>
                  <FileList>
                  {files.map((file, index) => (
                      <Row key={index} type='horizontal' style={{gap: '10px'}}>
                          <File>
                                  {oldFiles.some(oldFile => oldFile === file) ?
                                      <ImgBox>
                                          <span>{index+1})</span>
                                          <Img src={file} alt={file}/>
                                      </ImgBox> :
                                      <TextBox>{index+1}) {file}</TextBox>
                                  }
                                  <Row type='horizontal' style={{gap: '20px'}}>
                                      {files.length > 1 && <HiTrash size={20}
                                                color='#ccc'
                                                onClick={() => removeImage(file)}/>}
                                      <Checkbox id={file}
                                                checked={mainImgIndex === file}
                                                value={file}
                                                onChange={()=> changeMainImg(file)}/>
                                  </Row>

                          </File>
                      </Row>)
                  )}
              </FileList>
                  </Row>
              )}
              <FileInput id="images" accept="image/*"
                         multiple={true}
                         {...register('images', {
                             onChange: updateFileList,
                             required: isEditSession ? false : 'This field is required'})}/>{/*type=file*/}
          </Row>
      </FormRow>

      <FormRow>
        <Button variation="secondary"
                type="reset"
                onClick={()=> onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          { isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}
CreateEditCabinForm.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func
}
CreateEditCabinForm.defaultProps = {}
export default CreateEditCabinForm;
