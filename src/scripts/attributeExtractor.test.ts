import { attributeExtractor } from './attributeExtractor'

test('should work', () => {
    const schema = `
model SomeModel {
    id String @id @default(auto()) @map("_id") @db.ObjectId
}`
    expect(attributeExtractor(schema)).toBe(`
model SomeModel {
    /// @map("_id") @db.ObjectId
    id String @id @default(auto()) @map("_id") @db.ObjectId
}`)
})
test('should work without indentation', () => {
    const schema = `
model SomeModel {
id String @id @default(auto()) @map("_id") @db.ObjectId
}`
    expect(attributeExtractor(schema)).toBe(`
model SomeModel {
/// @map("_id") @db.ObjectId
id String @id @default(auto()) @map("_id") @db.ObjectId
}`)
})
