export const useReferenceData = () => {

  const flattenTree = (items: any[], parentId: any = null, level = 0) => {
    let result: any[] = [];
    
    const children = items.filter(item => item.parent_id == parentId);
    
    for (const child of children) {
      const prefix = level > 0 ? "— ".repeat(level) : "";
      
      result.push({
        label: prefix + (child.nama_unit || child.nama_unit_kerja || child.nama),
        value: child.id
      });
      
      const grandkids = flattenTree(items, child.id, level + 1);
      result = [...result, ...grandkids]; 
    }
    
    return result;
  };

  const buildTree = (items: any[], parentId: any = null): any[] => {
    return items
      .filter(item => item.parent_id == parentId)
      .map(item => ({
        id: item.id,
        label: item.nama_unit || item.nama_unit_kerja || item.nama,
        children: buildTree(items, item.id),
      }));
  };

  const getGolongan = async () => {
    try {
      const response = await useApi<any>("/golongan");
      return (
        response?.data?.map((item: any) => ({
          label: item.nama_golongan || item.nama,
          value: item.id,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching golongan:", error);
      return [];
    }
  };


  const getUnitKerja = async () => {
    try {
      const response = await useApi<any>("/unit-kerja");
      const allData = response?.data || [];
      return {
        dropdown: flattenTree(allData),
        tree: buildTree(allData),
      };
    } catch (error) {
      console.error("Error fetching unit kerja:", error);
      return { dropdown: [], tree: [] };
    }
  };

  return {
    getGolongan,
    getUnitKerja,
  };
};
